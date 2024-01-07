## Highlights
{% for annotation in annotations %}{% if annotation.color == "#ffd400" %}{% if annotation.annotatedText %}
> <mark style="background: #ffd400;">{{annotation.annotatedText}}</mark>{% endif %}
> {%- if annotation.imageRelativePath %}![[{{annotation.imageRelativePath}}]]{%- endif %}{% if annotation.comment %}
> {{annotation.comment}}{% endif %}- [pg {{annotation.page}}]({{annotation.desktopURI}})
{% endif %}{% endfor %}