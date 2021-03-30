{# Ovewrites: https://github.com/jupyter/nbconvert/blob/master/share/jupyter/nbconvert/templates/lab/index.html.j2 #}
{%- extends "lab/index.html.j2" -%}

{# CHANGE: Remove full HTML tags from header block #}
{% block header %}
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

{% block jupyter_widgets %}
  {%- if "widgets" in nb.metadata -%}
    {{ jupyter_widgets(resources.jupyter_widgets_base_url, resources.html_manager_semver_range) }}
  {%- endif -%}
{% endblock jupyter_widgets %}

{% for css in resources.inlining.css -%}
  <style type="text/css">
    {# CHANGE: replace .highlight with .highlight-ipynb #}
    {{ css | replace(".highlight ", ".highlight-ipynb " ) }}
  </style>
{% endfor %}

{% block notebook_css %}
{{ resources.include_css("static/index.css") }}
{% if resources.theme == 'dark' %}
    {{ resources.include_css("static/theme-dark.css") }}
{% else %}
    {{ resources.include_css("static/theme-light.css") }}
{% endif %}
{%- endblock notebook_css %}

{# CHANGE: Add the jupyter-fixes.css #}
<style>
{% include "css/jupyter-fixes.css" %}
</style>

{%- endblock header %}
