Title: Extracting NBA data from ESPN
Slug: nba-scraping-data
Date: 2013-4-1
Tags: Python,Crawling,Pandas,Requests,Beautiful Soup
Author: Daniel Rodriguez

I've been wanting to play with some sports data for a while. Today I decide to
stop procastinating and do it. The problems was that after searching a
while (15 minutes) for some data I was unable to find the data I wanted.
Even in the [Basktetball Database](http://www.databasebasketball.com/)
(not really sure I undestand the site).

A friend showed me the [ESPN](http://espn.go.com/nba/) stats and ask me if I
knew how to scrap the data from a website. I lied and told him Yes.
But I know python and its magic powers so after reading 15 minutes I knew how to do it.

I used [requests](http://docs.python-requests.org/en/latest/) and
[beautifulsoup](http://www.crummy.com/software/BeautifulSoup/) to download and
scrap the data from the ESPN site. Then used [pandas](http://pandas.pydata.org/)
to order, slice, and save the data into simple csv files. Also used
[iPython notebooks](http://ipython.org/) to develop the code faster.
And a little bit of my [copper](https://github.com/danielfrg/copper)
project to use the data analysis project structure.

## Get the teams

First I needed to get all the team names and URLs. So is as simple as request
[http://espn.go.com/nba/teams](http://espn.go.com/nba/teams) and 32 lines of python.

```python
import copper
import pandas as pd
import requests
from bs4 import BeautifulSoup
copper.project.path = '../../'

url = 'http://espn.go.com/nba/teams'
r = requests.get(url)

soup = BeautifulSoup(r.text)
tables = soup.find_all('ul', class_='medium-logos')

teams = []
prefix_1 = []
prefix_2 = []
teams_urls = []
for table in tables:
    lis = table.find_all('li')
    for li in lis:
        info = li.h5.a
        teams.append(info.text)
        url = info['href']
        teams_urls.append(url)
        prefix_1.append(url.split('/')[-2])
        prefix_2.append(url.split('/')[-1])


dic = {'url': teams_urls, 'prefix_2': prefix_2, 'prefix_1': prefix_1}
teams = pd.DataFrame(dic, index=teams)
teams.index.name = 'team'
print(teams)
copper.save(teams, 'teams')
```

This saves `teams.csv` file with the 30 teams in this format.

```csv
team,prefix_1,prefix_2,url
Boston Celtics,bos,boston-celtics,http://espn.go.com/nba/team/_/name/bos/boston-celtics
Brooklyn Nets,bkn,brooklyn-nets,http://espn.go.com/nba/team/_/name/bkn/brooklyn-nets
......
```

## Get games

Then I needed the games information. For this is necessary to read the previous
csv file and for each team make a request and parse the data. On this case
60 lines of python produced a 1084 rows csv file with all the games of the current
(2013) season. But is as simple as changing a variable to download other seasons information.

```python
import copper
import numpy as np
import pandas as pd
import requests
from bs4 import BeautifulSoup
from datetime import datetime, date
copper.project.path = '../../'

year = 2013
teams = copper.read_csv('teams.csv')
BASE_URL = 'http://espn.go.com/nba/team/schedule/_/name/{0}/year/{1}/{2}'

match_id = []
dates = []
home_team = []
home_team_score = []
visit_team = []
visit_team_score = []

for index, row in teams.iterrows():
    _team, url = row['team'], row['url']
    r = requests.get(BASE_URL.format(row['prefix_1'], year, row['prefix_2']))
    table = BeautifulSoup(r.text).table
    for row in table.find_all('tr')[1:]: # Remove header
        columns = row.find_all('td')
        try:
            _home = True if columns[1].li.text == 'vs' else False
            _other_team = columns[1].find_all('a')[1].text
            _score = columns[2].a.text.split(' ')[0].split('-')
            _won = True if columns[2].span.text == 'W' else False

            match_id.append(columns[2].a['href'].split('?id=')[1])
            home_team.append(_team if _home else _other_team)
            visit_team.append(_team if not _home else _other_team)
            d = datetime.strptime(columns[0].text, '%a, %b %d')
            dates.append(date(year, d.month, d.day))

            if _home:
                if _won:
                    home_team_score.append(_score[0])
                    visit_team_score.append(_score[1])
                else:
                    home_team_score.append(_score[1])
                    visit_team_score.append(_score[0])
            else:
                if _won:
                    home_team_score.append(_score[1])
                    visit_team_score.append(_score[0])
                else:
                    home_team_score.append(_score[0])
                    visit_team_score.append(_score[1])
        except Exception as e:
            pass # Not all columns row are a match, is OK
            # print(e)

dic = {'id': match_id, 'date': dates, 'home_team': home_team, 'visit_team': visit_team,
        'home_team_score': home_team_score, 'visit_team_score': visit_team_score}

games = pd.DataFrame(dic).drop_duplicates(cols='id').set_index('id')
print(games)
copper.save(games, 'games')
```

## Get player stats

All the previous data is good but for doing some analysis I need players stats.
Then for each game I download all players stats for that game. The result was
55 lines of python (imports included) to generate 27645 rows full with stats.

``` python
import copper
import numpy as np
import pandas as pd
import requests
from bs4 import BeautifulSoup
from datetime import datetime, date
copper.project.path = '../..'

games = copper.read_csv('games.csv').set_index('id')
BASE_URL = 'http://espn.go.com/nba/boxscore?gameId={0}'

request = requests.get(BASE_URL.format(games.index[0]))

table = BeautifulSoup(request.text).find('table', class_='mod-data')
heads = table.find_all('thead')
headers = heads[0].find_all('tr')[1].find_all('th')[1:]
headers = [th.text for th in headers]
columns = ['id', 'team', 'player'] + headers

players = pd.DataFrame(columns=columns)

def get_players(players, team_name):
    array = np.zeros((len(players), len(headers)+1), dtype=object)
    array[:] = np.nan
    for i, player in enumerate(players):
        cols = player.find_all('td')
        array[i, 0] = cols[0].text.split(',')[0]
        for j in range(1, len(headers) + 1):
            if not cols[1].text.startswith('DNP'):
                array[i, j] = cols[j].text

    frame = pd.DataFrame(columns=columns)
    for x in array:
        line = np.concatenate(([index, team_name], x)).reshape(1,len(columns))
        new = pd.DataFrame(line, columns=frame.columns)
        frame = frame.append(new)
    return frame

for index, row in games.iterrows():
    print(index)
    request = requests.get(BASE_URL.format(index))
    table = BeautifulSoup(request.text).find('table', class_='mod-data')
    heads = table.find_all('thead')
    bodies = table.find_all('tbody')

    team_1 = heads[0].th.text
    team_1_players = bodies[0].find_all('tr') + bodies[1].find_all('tr')
    team_1_players = get_players(team_1_players, team_1)
    players = players.append(team_1_players)

    team_2 = heads[3].th.text
    team_2_players = bodies[3].find_all('tr') + bodies[4].find_all('tr')
    team_2_players = get_players(team_2_players, team_2)
    players = players.append(team_2_players)

players = players.set_index('id')
print(players)
copper.save(players, 'players')
```

The file looks like this
```
,id,team,player,MIN,FGM-A,3PM-A,FTM-A,OREB,DREB,REB,AST,STL,BLK,TO,PF,+/-,PTS
0,400277722,Boston Celtics,Brandon Bass,28,6-11,0-0,3-4,6,5,11,1,0,0,1,2,-8,15
0,400277722,Boston Celtics,Paul Pierce,41,6-15,2-4,9-9,0,5,5,5,2,0,0,3,-17,23
...
0,400277722,Miami Heat,Shane Battier,29,2-4,2-3,0-0,0,2,2,1,1,0,0,3,+12,6
0,400277722,Miami Heat,LeBron James,29,10-16,2-4,4-5,1,9,10,3,2,0,0,2,+12,26
0,400277722,Miami Heat,Chris Bosh,37,8-15,0-1,3-4,2,8,10,1,0,3,1,3,+15,19
..... A LOT OF DATA .....
```

## Conclusion

I love python more.

Still a **lot** of work is needed in order to make sense of all that data. But
at least now I have some data.

Next step is probably to insert the data into a [postgres](http://www.postgresql.org/)
database. Or just be crazy and do some machine learning as it is.

The data and code is on github [nba](https://github.com/danielfrg/nba).
