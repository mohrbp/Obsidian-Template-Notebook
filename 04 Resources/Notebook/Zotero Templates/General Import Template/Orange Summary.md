## Main Takeaways
{% for annotation in annotations %}{% if annotation.annotatedText %}{% if annotation.color == "#f19837" %}- <mark style="background: #f19837;">{{annotation.annotatedText}}</mark> - [pg {{annotation.page}}]({{annotation.desktopURI}})
{% endif %}{% endif %}{% endfor %}