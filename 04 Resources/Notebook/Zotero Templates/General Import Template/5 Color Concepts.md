## Keywords and Concepts
{% for annotation in annotations %}{% if annotation.color == "#ff6666" %}{% if annotation.annotatedText %}{% if annotation.comment == "keyword" %}### {{annotation.annotatedText}}
{% else %}><mark style="background: #ff6666;">{{annotation.annotatedText}}</mark>  - [pg {{annotation.page}}]({{annotation.desktopURI}})
>{% endif %}{% endif %}{%- if annotation.imageRelativePath %}> ![[{{annotation.imageRelativePath}}]]- [pg {{annotation.page}}]({{annotation.desktopURI}})
{%- endif %}{% if annotation.comment != "keyword" %}
> {{annotation.comment}}
{% endif %}{% endif %}{% endfor %}{% for annotation in annotations %}{% if annotation.color == "#5fb236" %}{% if annotation.annotatedText %}{% if annotation.comment == "keyword" %}### {{annotation.annotatedText}}
{% else %}><mark style="background: #5fb236;">{{annotation.annotatedText}}</mark>  - [pg {{annotation.page}}]({{annotation.desktopURI}})
>{% endif %}{% endif %}{%- if annotation.imageRelativePath %}> ![[{{annotation.imageRelativePath}}]]- [pg {{annotation.page}}]({{annotation.desktopURI}})
{%- endif %}{% if annotation.comment != "keyword" %}
> {{annotation.comment}}
{% endif %}{% endif %}{% endfor %}{% for annotation in annotations %}{% if annotation.color == "#2ea8e5" %}{% if annotation.annotatedText %}{% if annotation.comment == "keyword" %}### {{annotation.annotatedText}}
{% else %}><mark style="background: #2ea8e5;">{{annotation.annotatedText}}</mark> {{annotation.color}}  - [pg {{annotation.page}}]({{annotation.desktopURI}})
>{% endif %}{% endif %}{%- if annotation.imageRelativePath %}> ![[{{annotation.imageRelativePath}}]]- [pg {{annotation.page}}]({{annotation.desktopURI}})
{%- endif %}{% if annotation.comment != "keyword" %}
> {{annotation.comment}}
{% endif %}{% endif %}{% endfor %}{% for annotation in annotations %}{% if annotation.color == "#a28ae5" %}{% if annotation.annotatedText %}{% if annotation.comment == "keyword" %}### {{annotation.annotatedText}}
{% else %}><mark style="background: #a28ae5;">{{annotation.annotatedText}}</mark> {{annotation.color}} - [pg {{annotation.page}}]({{annotation.desktopURI}})
>{% endif %}{% endif %}{%- if annotation.imageRelativePath %}> ![[{{annotation.imageRelativePath}}]]- [pg {{annotation.page}}]({{annotation.desktopURI}})
{%- endif %}{% if annotation.comment != "keyword" %}
> {{annotation.comment}}
{% endif %}{% endif %}{% endfor %}{% for annotation in annotations %}{% if annotation.color == "#e56eee" %}{% if annotation.annotatedText %}{% if annotation.comment == "keyword" %}### {{annotation.annotatedText}}
{% else %}><mark style="background: #e56eee;">{{annotation.annotatedText}}</mark>  - [pg {{annotation.page}}]({{annotation.desktopURI}})
>{% endif %}{% endif %}{%- if annotation.imageRelativePath %}> ![[{{annotation.imageRelativePath}}]]- [pg {{annotation.page}}]({{annotation.desktopURI}})
{%- endif %}{% if annotation.comment != "keyword" %}
> {{annotation.comment}}
{% endif %}{% endif %}{% endfor %}