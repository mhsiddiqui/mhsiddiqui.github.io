---
layout: page
title: Tags
permalink: /tags/
---

{% assign rawtags = "" %}
{% for post in site.posts %}
{% assign ttags = post.tags | join:'|' | append:'|' %}
{% assign rawtags = rawtags | append:ttags %}
{% endfor %}

{% assign rawtags = rawtags | split:'|' | sort %}

{% assign tags = "" %}

{% for tag in rawtags %}
{% if tag != "" %}

{% if tags == "" %}
{% assign tags = tag | split:'|' %}
{% endif %}

{% unless tags contains tag %}
{% assign tags = tags | join:'|' | append:'|' | append:tag | split:'|' %}
{% endunless %}
{% endif %}
{% endfor %}

<div>
	<div style="margin-bottom: 10px">
		{% for tag in tags %}
		<button data-target="#{{ tag|slugify|downcase }}" class="tag-box"><i class="fi-xwluxl-label-wide"></i> {{ tag }}</button>
		{% endfor %}
	</div>
	{% for tag in tags %}
	<h2 id="{{ tag | slugify | downcase }}">{{ tag }}</h2>
	<ul class="codinfox-category-list">
		{% for post in site.posts %}
		{% if post.tags contains tag %}
		<li>
			<div class="post-title">
				<a href="{{ post.url }}">
					{{ post.title }}
				</a>
			</div>
			<small class="posted-date">{{ post.date | date_to_string }}</small>
		</li>
		{% endif %}
		{% endfor %}
	</ul>
	{% endfor %}

</div>