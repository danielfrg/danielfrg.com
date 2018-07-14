Title: One-liner: Deploy python scipy stack with IPython notebook on AWS
Slug: ipython-notebook-aws-salt
Date: 2013-11-27
Tags: Python,AWS,Salt,IPython Notebook
Author: Daniel Rodriguez

**Problem:** How many times have you needed to create a powerful EC2 instance with the the python scientific stack
installed and the ipython notebook running? I have to do this at least 2 or 3 times every week.

A simple solution is to have an AMI with all the libraries ready and create a new instance every time,
you can even have the ipython notebook as an upstart service in ubuntu so it runs when the instance is ready.
That was my previous solution, but that was before I learned [salt](http://saltstack.com/).

The problem with the AMI solution is that it gets dated really quickly and while update it is not hard, it is
annoying. Also having to login into AWS, look for the AMI and spin up and instance is annoying.

**Solution:** [Salt](http://saltstack.com/) + [Anaconda](http://continuum.io/downloads) + [Vagrant](http://www.vagrantup.com/)

Salt will do the provisioning of the instance using states, that makes the updates of new instances simple as changing a YAML file.
Anaconda is the best python scientific distribution I have found and the conda package manager is the perfect solution to install the scientific libraries, I don't want to compile numpy and scipy every time I create the instances, that takes at least 30 minutes.
Vagrant is used to create the instance and provision it with salt using one command.

Install conda using a salt states is pretty easy because salt has support for pip, and conda is pip
installable (you have to run `conda init` after `pip install conda`) so is as simple as:

```YAML
pip-packages:
  pip.installed:
    - user: root
    - names:
      - conda
    - require:
      - pkg: python-dev
      - pkg: python-pip

conda-check:
  cmd.run:
    - user: ubuntu
    - name: "[ -d /usr/conda-meta ] && echo 'changed=no' || echo 'changed=yes'"
    - stateful: True
    - require:
      - pip: conda

# This will create some files into /usr, needs root
conda-init:
  cmd.wait:
    - user: root
    - name: "conda init"
    - watch:
        - cmd: conda-check
```

The main issue was that salt didn't have support for conda, so I [wrote my first salt module](http://github.com/danielfrg/salt-conda/blob/master/conda.py) to manage conda virtual environments using salt.
The code below will create a conda virtual env and
install the ipython-notebook, numpy, scipy and pandas libraries using the conda repository
also will install luigi (or any other python library you want) using regular pip.
All of this will be inside the conda virtual env, because you **should** use virtual envs.

```YAML
venv:
  conda.managed:
    - user: ubuntu
    - pkgs: ipython-notebook,numpy,scipy,pandas,scikit-learn
    - require:
      - cmd: conda-init

venv-pip:
  pip.installed:
    - user: ubuntu
    - names:
      - luigi
    - bin_env: /home/ubuntu/envs/venv/bin/pip
    - require:
      - conda: venv
```

I created another module to start the ipython notebook in the background since salt does not support this natively, the state looks like this:

```YAML
/home/vagrant/nbserver.pid:
  nbserver.start_server:
    - ip: 0.0.0.0
    - port: 80
    - nb_dir: /home/ubuntu/notebooks
    - require:
      - conda: venv
```

The final peace of the puzzle is how to spin up the instance quickly, Vagrant with the AWS provider is the solution.

Vagrant is mainly used for development, and I use it to develop this solution but it also has a nice
integration with AWS, so on the `Vagrantfile` you only need to change the AWS credentials and the
instance configuration.

```ruby
Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # AWS Provider
  config.vm.provider :aws do |aws, override|
    aws.access_key_id = ""
    aws.secret_access_key = ""
    aws.keypair_name = "daniel_keypair"

    aws.security_groups = ["default"]
    aws.instance_type = "c3.xlarge"
    aws.availability_zone = "us-east-a"
    aws.ami = "ami-a73264ce"  # Precise 12.04 64 bits

    override.vm.box = "dummy"
    override.ssh.username = "ubuntu"
    override.ssh.private_key_path = "~/.ssh/my_keypair.pem"
  end
```

How you only need to run `vagrant up --provider aws` and it will create an instance and provision it
with salt. Then just go to the URL of the EC2 instance and the notebook will be running in port 80.

NOTE: Be sure to use a security group with port 22 and 80 open

There are more things you can configure for your notebook such as passwords and more security, take a look [here](https://gist.github.com/iamatypeofwalrus/5183133). Also there are more solutions available
such as [Continnums Wakari](https://www.wakari.io/) that I personally think is an overkill, I am sure is perfect for some people but not for me.

This solution gives you the notebook up and running in two minutes, and if you need more control on the instance you can just SSH to it and do whatever you want. Also you only pay the Amazon fees, so for my personal needs is the perfect solution.

The whole code is on github: [salt conda module](https://github.com/danielfrg/salt-conda), look in `example/ipythonnb`
