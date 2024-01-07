## {{title}}
> [!Metadata]- 
> - **Authors**: {{authors}}
> - **Date**: {{date | format ("YYYY")}}
> - {% if publicationTitle %}**Publication**: {{publicationTitle}}{% endif %}
> - **Abstract:** {{abstractNote|replace("\n"," ")}} 
> - **Sources**: [online]({{uri}}) [local]({{desktopURI}}) {%- for attachment in attachments | filterby("path", "endswith",".pdf") %} [pdf](file:///{{attachment.path | replace(" ","%20")}}) {% if loop.last %}{% endif %}{%- endfor %}
> - **Bibliography**: {{bibliography}}{% if tags.length >0 %}
> - **Tags:** {% for t in tags %}{{t.tag}}{% if not loop.last %}, {% endif %}{% endfor %}{% endif %}{% if collections.length >0 %}
> - **Collections:** {% for c in collections %}[[{{c.name}}]]{% if not loop.last %}, {% endif %}{% endfor %}{% endif %}