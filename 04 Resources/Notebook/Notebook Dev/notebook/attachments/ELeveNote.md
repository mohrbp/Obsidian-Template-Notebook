---
category: "[[Clippings]]"
author: "[[Eleven Therapeutics]]"
title: "ELeveNote"
source: https://medium.com/@eleventx/elevenote-elevens-proprietary-electronic-lab-notebook-platform-7baa8398bedb
clipped: 2024-01-25
published: 
topics: 
tags: [clippings]
---

![](https://miro.medium.com/v2/resize:fit:1050/1*5nlJbEJtdnNcM3SY9vrScA.png)

## how we created our proprietary electronic lab notebook system on top of Notion, boosted productivity using AI, and saved massive amount of money

[

![Eleven Therapeutics](https://miro.medium.com/v2/resize:fill:66:66/1*ch141CNcN6tmzxuya-Av-w.png)









](https://medium.com/@eleventx?source=post_page-----7baa8398bedb--------------------------------)

**By: Omer Weissbrod, Era Duek, and Ohad Yogev @**

Due to popular demand, we created two free resources for the biotech community:  
1\. [A live demo that lets you see what ELeveNote looks like first-hand](https://elevenote.notion.site/elevenote/ELeveNote-Demo-ce286075b8b04b138ba4844294a2ae7c)

2\. [A Notion template that lets you deploy ELeveNote on your own Notion workspace with the click of a button](https://elevenote.notion.site/elevenote/ELeveNote-Template-4c449a8e089340e9945db6beefb74cdd)

Every biotech organization has a moat: its research data. However, this data is truly valuable only if it’s well documented, accessible, traceable, and replicable. The unsung hero of biotech organizations is therefore the Electronic Lab Notebook (ELN) — the digital backbone of their research data. For us at [Eleven Therapeutics](http://eleventx.com/), this backbone was a commercial ELN. To not name names, we’ll call our commercial ELN the **B**iotech **L**ab **I**ntegrated **N**otebooks **G**oldmine — or in short BLING.

BLING was initially our go-to ELN. But as Eleven grew, BLING’s costs grew faster, eroding our bottom line as a seed stage startup. BLING was also too rigid for our needs — it didn’t encourage uniform work processes, experiments were not documented in a consistent manner, and it was hard for people to find specific experiments and relevant information.

So, when the cost became too much to justify, it wasn’t a setback; it was our ‘aha’ moment. It forced us to stop and think about how we were doing things. Did our current system truly reflect the way we wanted to work, or were we just adapting to the constraints of a platform that wasn’t built for us? The decision to say goodbye to BLING became the catalyst for a bigger change. It wasn’t just about saving money; it was about building an ELN that worked for us, not the other way around.

In came **ELeveNote**, born from the need for clarity, accessibility, traceability, and replicability. We wanted an ELN that enhances our work instead of dictating it. The focus shifted from just documenting to optimizing our work processes, integrating the principles of well documented, accessible, traceable, and replicable research into our day-to-day operations.

In our quest for a better ELN solution we turned to [Notion](https://www.notion.so/) — an industry-leading organizational productivity tool that we already used for our internal wiki and portal. This was our launchpad for **ELeveNote**. **ELeveNote** isn’t just a new system; it’s a way to align everyone in the company around common work processes that are directly integrated into the ELN architecture.

The central entity in **ELeveNote** is an experiment. Every experiment has its own unique ID, and every readout from every lab assay belongs to a single experiment. Every experiment also has a unique directory with all of its raw data, in a known location in our Google cloud storage. When presenting results, every result shown must be accompanied by its experiment ID. This design makes all experimental data accessible to all, solving the common problem of data scattered across personal hard drives, email attachments, and elsewhere.

At the heart of **ELeveNote’s** design is Notion’s native blend of structured and unstructured fields. This means that for every experiment, there’s a place for the rigid, must-have details — things like experimenter, reviewer, protocols, materials, and raw data. These structured fields ensure consistency and ease of tracking across different projects. On the other side, each experiment includes a rich text page resembling a traditional lab notebook, where experimenters can write down observations and conclusions. Once an entry is completed, it is locked and can never be modified again under normal circumstances. This blend of structured precision and narrative freedom allows capturing the full spectrum of an experiment, from the hard data to the subtle insights.

The core of **ELeveNote’s** user interface is a specialized Notion view tailored to each user. When a user logs in they see exactly what they need — their ongoing experiments and experiments waiting for their review — without the clutter of irrelevant information.

![](https://miro.medium.com/v2/resize:fit:1050/0*YT8m5ofbCgd3Q-Jt)

A user-specific **ELeveNote** view

**ELeveNote** simplifies experiment documentation via Notion’s powerful database capabilities. When setting up an experiment, you can choose a protocol and a risk assessment from our integrated databases, and all the relevant materials and methods are automatically linked and populated in your entry. This reduces the room for human error and ensures that our team’s energy is channeled into innovation, not administrative hurdles.

![](https://miro.medium.com/v2/resize:fit:1050/1*vEraj6vXt3zaSrr2_0a8dg.png)

A snapshot of **ELeveNote’**s protocols database

On top of these, the contrast in costs between BLING and our in-house **ELeveNote** is staggering.

> **ELeveNote** costs 10x less than BLING, potentially saving us hundreds of thousands of dollars a year.

A major factor in deciding to use Notion was its built-in AI functionality, which can speed up some writing tasks by 10–100x. There are endless examples, but we’ll focus on two.

**Protocol development**: With Notion AI, we can collaborate with the AI for protocol writing, focusing on the essence and letting the AI do the writing and editing.

![](https://miro.medium.com/v2/resize:fit:1050/1*9cl-NOPAVZhcyVpZPKJAOA.gif)

Writing the first draft of a protocol in Notion AI

**Conclusion writing**: Notion AI assists in synthesizing data and observations into coherent, well-structured narratives. Instead of staring at a blank page, our researchers start with an AI-generated draft that they can refine as needed.

![](https://miro.medium.com/v2/resize:fit:1050/1*KAwVk9dUEuN7HI-ySOe1DA.gif)

Drafting experiment conclusions in Notion AI

We also make extensive use of Notion Q&A, which allows querying for information in natural language. Since **EleveNote** integrates seamlessly with our existing Notion knowledge bases, we can ask questions in plain English and receive answers as if it were a digital lab assistant. Questions like, “*What were the results of last month’s LCMS assay?*” are answered in moments. This feature alone is transforming the way we interact with our data, making information retrieval as easy as a casual conversation.

![](https://miro.medium.com/v2/resize:fit:725/0*oiGqalkJGZtwzdS2)

Using Notion Q&A to query for information

Regulatory compliance is critical in biotech. Before the work on **ELeveNote** began, we verified that Notion is compliant with common regulatory standards such as [SOC2 Type 2](https://www.notion.so/blog/notion-soc-2-compliant), [ISO 27001](https://www.notion.so/blog/were-iso-27001-compliant-heres-what-that-means-for-you), [GDPR](https://www.notion.so/security), and [CCPA](https://www.notion.so/help/privacy). We took several measures to maintain regulatory compliance.

First, **ELeveNote** utilizes the advanced page history and audit log capabilities available for Notion Enterprise Plan customers. This means that every edit operation is tracked and recorded. Second, every piece of experimental data is stored inside **ELeveNote** itself, in addition to its disposition in shared cloud storage (with only a few exceptions, see below). The raw data in **ELeveNote** is considered as the single source of truth for regulatory purposes. The secure AWS S3 storage system used by Notion guarantees that all experimental data is unmodifiable and accounted for. For larger datasets such as high-throughput sequencing data, we use **ELeveNote** to document comprehensive metadata, including file hashes, ensuring that these datasets are systematically referenced, accessible, and unaltered. Third, **ELeveNote** is backed up automatically at regular intervals with cryptographically hashed timestamps. Fourth, we hired a regulatory QA firm to confirm that **ELeveNote** is potentially compliant with [FDA 21 CFR Part 11](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/part-11-electronic-records-electronic-signatures-scope-and-application) and [EU Annex 11](https://health.ec.europa.eu/system/files/2016-11/annex11_01-2011_en_0.pdf).

Combined, these solutions ensure that every action taken within **ELeveNote** is traceable and verifiable, offering undeniable proof of our research’s progression and completion.

We use Notion’s rich database system to encode ontologies capturing complex experimental constructs. As an example, we’ve constructed a series of databases dedicated to different elements of chemically modified RNA (xRNA) — like the 5’cap, 5'UTR, coding sequence, and 3'UTR. These individual databases serve as building blocks, cataloging the fundamental components of our xRNA studies. To allow easy use, we’ve also designed a web app for designing an xRNA element sequence via a convenient user interface. But the real magic happens when we bring all these elements together in our xRNA database. This database features relational fields linking to each component database, allowing us to assemble complete xRNA sequences in a structured and methodical manner.

![](https://miro.medium.com/v2/resize:fit:1050/1*Wexeiz9XcEZ6HvlCQtqZ_w.png)

A Web app for designing xRNA sequences

Moreover, we can perform diagnostics and represent chemical modifications on the assembled sequences directly within Notion. This is enabled thanks to [Notion’s recently introduced Formulas 2.0](https://www.notion.so/help/guides/new-formulas-whats-changed), which are essentially a mini programming-language.

![](https://miro.medium.com/v2/resize:fit:1050/0*DLN8pv_QDKdFxMn_)

A snapshot of a Notion formula for assembling a full xRNA sequence from its building blocks

Crucially, the integrated nature of Notion’s database system means that these detailed xRNA constructs can be directly linked to **ELeveNote’**s entries. The result is a richer record of our experiments, where every element, from individual xRNA modifications to complete sequences, is tracked and accessible.

Data integrity is paramount in biotech. That’s why we’ve developed a robust monitoring and auditing system, utilizing Notion’s rich API. Specifically, we’ve developed a series of Web Apps, created with the simplicity of *Voila* — a tool that transforms Jupyter notebooks into interactive dashboards — to design **ELeveNote** dashboards. These dashboards serve as the operational nerve center for **ELeveNote.** They monitor essential metrics, such as experiments pending review, and ensure that every mandatory field is populated correctly.

![](https://miro.medium.com/v2/resize:fit:1050/0*vCyTfzJlroyIzubV)

A snapshot of the **ELeveNote** dashboards

Although Notion is very powerful, it cannot by itself serve as a full replacement for BLING: Notion doesn’t include additional tools available in BLING, such as inventory management and molecular biology tools. To fill these gaps, we use external stand-alone tools and reflect their contents in Notion databases. For each external tool, we can write a simple automated process that maintains a Notion database reflecting the contents of the external tool. This allows linking **EleveNote** entries to specific entities from the external tool, without having to integrate the tool directly into **ELeveNote**.

![](https://miro.medium.com/v2/resize:fit:1050/0*64vWLwMMQI-Xje3C)

A snapshot of **ELeveNote**’s inventory database, reflecting an external tool

**ELeveNote** acts as a portal to a more expansive system we’ve put in place. This system simplifies how we aggregate data across experiments for a joint analysis. The process starts within the familiar confines of **ELeveNote**, where researchers upload structured Excel files into a designated field. From there, an automated process extracts data from these Excel files into a centralized database. This setup allows researchers to remain in the confines of **ELeveNote** and stay focused on their core tasks. This not only saves time but also ensures that our data is consistently processed and stored. We plan to delve deeper into our database integration with **ELeveNote** in a future post.

![](https://miro.medium.com/v2/resize:fit:1050/0*benu-QaLAfknGusL)

A snapshot of a part of our data infrastructure architecture

When we decided to migrate from BLING to **ELeveNote**, it became clear this would be a delicate process that must be handled carefully. We took several measures to make the transition as smooth as possible. First, we performed a long pilot spanning several months, during which we collected feedback from brave beta users and continually refined the system. Second, we held and recorded a company-wide tutorial session in which we described **ELeveNote** in detail. Third, we set up two online quizzes to test people’s knowledge, which everyone in the company took, including senior management. Fourth, we opened a dedicated space in our internal chat system where everyone can ask questions, report issues, and feed off each other’s knowledge. Fifth, we periodically send out news bulletins with updates, usage statistics, and tips for better use. Finally, our operations team continuously monitors **ELeveNote** via our dashboards, and is in constant communication with our scientists to refine and improve their use of **ELeveNote**.

![](https://miro.medium.com/v2/resize:fit:1050/0*X8NkzVSbzJIl74mf)

A snapshot of one of our **ELeveNote** newsletters

The shift from BLING to **ELeveNote** has been an educating journey for us. It began as a necessity — to find a sustainable financial path for experiment tracking — but it evolved into a transformative process that has reshaped how we handle experiments. **ELeveNote** integrates our work processes directly into our tools, leading to improved efficiencies and a significant reduction in costs. Overall, we’ve laid a foundation that’s not only scalable but also adaptable to the ever-changing landscape of biotech research.

If you have insights, questions, or a story of your own to share about navigating the ELN landscape, we’d love to hear it. Your input can help shape the conversation on how we all approach these vital tools for research and data management.