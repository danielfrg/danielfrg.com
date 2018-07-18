{%- extends 'basic.tpl' -%}

{% block header %}
<style type="text/css">

div.input_area {
    max-width: 2000px;
}

.rendered_html a {
    text-decoration: none;
}

.rendered_html :link {
    text-decoration: none;
}

.rendered_html :visited {
    text-decoration: none;
}

.rendered_html h2, h3, h4, h2:first-child {
    margin-top: inherit;
}

.text_cell .prompt {
    display: none;
}

div.cell {
    padding: 0;
}

div.text_cell_render {
    padding: 0;
}

div.prompt {
    font-size: 13px;
}

div.input_prompt {
    padding: .7em 0.2em;
}

div.output_prompt {
    padding: .4em .2em;
}

div.input_area {
    margin: .2em 0.4em;
    max-width: 750px;
}

table.dataframe {
    font-family: Arial, sans-serif;
    font-size: 13px;
    line-height: 20px;
}

table.dataframe th, td {
    padding: 4px;
    text-align: left;
}

pre code {
    background-color: inherit;
}
</style>
{%- endblock header %}
