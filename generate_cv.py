#!/usr/bin/env python3
"""Generate Wisam Damouny's CV PDF (brand style, Inter)."""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer

HERE = os.path.dirname(os.path.abspath(__file__))
FONT = "/opt/data/tmp/inter.ttf"
OUT = os.path.join(HERE, "CV.pdf")

pdfmetrics.registerFont(TTFont("Inter", FONT))
pdfmetrics.registerFont(TTFont("InterB", FONT))  # bold shown via size/color; fine for CV

INK = HexColor("#1d1b1f"); ACCENT = HexColor("#6a4e3b"); MUTED = HexColor("#6f6b73")

def S(size=9.5, color=INK, leading=13.5, space=1.5):
    return ParagraphStyle("s%f" % size, fontName="Inter", fontSize=size, leading=leading,
                          textColor=color, spaceAfter=space, alignment=TA_LEFT)

def h2(text):
    return [Spacer(1, 8), Paragraph(text.upper(), S(9.5, ACCENT, 12, 3))]

def job(head, sub, items):
    flow = [Paragraph(head, S(10.5, INK, 14, 1)),
            Paragraph(sub, S(9, MUTED, 12, 2))]
    for it in items:
        flow.append(Paragraph("&bull;&nbsp;&nbsp;" + it.replace("&", "&amp;"), S(9.5, INK, 13.5, 1.5)))
    return flow

story = []
story.append(Paragraph("Wisam &nbsp;Damouny", S(24, INK, 26, 2)))
story.append(Paragraph("Software Technical Leader · AI &amp; Data Integration · Teaching / Consulting / Product Leadership",
                       S(10, ACCENT, 14)))
story.append(Paragraph("Shefa&ndash;Amr, Israel &nbsp;&nbsp;·&nbsp;&nbsp; +972-50-8855014 &nbsp;&nbsp;·&nbsp;&nbsp; wisam.damouny@gmail.com",
                       S(9, MUTED, 13)))

story += h2("Objective")
story.append(Paragraph(
    "Passionate and experienced Software Technical Leader with a strong foundation in AI, data integration, and "
    "systems programming. Seeking opportunities to contribute through teaching, consulting, or product leadership, "
    "bridging real-world technology with human-centered applications. Focused on combining hands-on engineering with "
    "strategic thinking to drive forward-looking solutions in education, AI, and enterprise software.", S(9.5)))

story += h2("Experience")
story += job("2020 – Present &nbsp;·&nbsp; Founder &amp; AI / SaaS Developer", "Independent",
             ["Founded and led multiple AI-powered SaaS initiatives focused on education, productivity, and automation.",
              "Designed and deployed full-stack, multilingual web applications.",
              "Applied LLMs for task automation, content generation, and intelligent interfaces.",
              "Integrated technologies like Supabase, React, Node.js, and vector databases.",
              "Managed product design and early-stage validation with real-world users."])
story += job("10/2019 – Present &nbsp;·&nbsp; Software Technical Lead &nbsp;·&nbsp; Qlik", "SAP data integration / AI diagnostics / Mentoring",
             ["Leading advanced SAP data-integration tools: performance, scalability, enterprise data modeling.",
              "Integrating AI-driven performance diagnostics and exploring autonomous task planning for replication pipelines.",
              "Mentoring engineers; initiated internal LLM/automation research.",
              "Improved project delivery time by 20% and data integration coverage by 60%."])
story += job("7/2017 – 10/2019 &nbsp;·&nbsp; Senior Software Engineer &nbsp;·&nbsp; Attunity (Galil Software)", "SAP HANA Replicate",
             ["Led the SAP HANA Replicate endpoint, contributing to a 70% increase in product performance.",
              "Mentored junior engineers, raising team skill levels by 50%; cross-team efficiency +30%."])
story += job("6/2015 – 6/2017 &nbsp;·&nbsp; Software Engineer &nbsp;·&nbsp; Qognify (Galil Software)", "NICE Vision NVR",
             ["Contributed to the NICE Vision Real-Time NVR connectors in C++/C#; multithreading and network protocols."])
story += job("12/2013 – 6/2015 &nbsp;·&nbsp; QA Automation Engineer &nbsp;·&nbsp; Nice Systems (Galil Software)", "Automation & test engineering",
             ["Designed automation solutions and led testing for complex systems in Java and JavaScript; built reports and dashboards."])

story += h2("Education")
story += job("B.Sc. Electrical Engineering (Computer Engineering) &nbsp;·&nbsp; TU Darmstadt, Germany", "2009 – 2013 · GPA 84 (German 2.7)",
             ["Focus on Computer Engineering."])
story += job("Bagrut Certificate &nbsp;·&nbsp; Greek Catholic School, Shefa&ndash;Amr, Israel", "2003 – 2006 · Majors: Math, Physics, Computer Science",
             ["Excellence Award – Israeli Ministry of Education."])

story += h2("Skills")
for label, text in [
    ("AI &amp; ML", "prompt engineering, on-prem LLMs, NLP, LangChain, RAG workflows"),
    ("Programming", "C/C++, Java, Python, JavaScript, React, NodeJS"),
    ("Systems &amp; Data", "SAP HANA, Qlik Replicate, data pipelines, streaming architectures"),
    ("Automation &amp; Testing", "AI-enhanced test frameworks, CI/CD, cloud-native deployment"),
    ("Languages", "English, Hebrew, Arabic, German"),
    ("Teaching &amp; Mentorship", "team mentoring, educational app development, technical training"),
]:
    story.append(Paragraph("%s: %s" % (label, text), S(9.5)))

story += h2("Community &amp; Activities")
for it in [
    "Delivered internal workshops on AI-driven automation and workflow optimization at Qlik.",
    "Active STEM mentor and community volunteer since 2004; led social-responsibility projects.",
    "Developed AI-powered reading tools for children (Arabic/Hebrew).",
    "Interests: AI &amp; Technology, Painting, Traveling, Classical Music.",
]:
    story.append(Paragraph("&bull;&nbsp;&nbsp;" + it, S(9.5)))

doc = BaseDocTemplate(OUT, pagesize=A4, leftMargin=18*mm, rightMargin=18*mm,
                      topMargin=16*mm, bottomMargin=16*mm,
                      title="Wisam Damouny — CV", author="Wisam Damouny")
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="f")
doc.addPageTemplates([PageTemplate(id="page", frames=[frame])])
doc.build(story)
print("wrote", OUT, os.path.getsize(OUT), "bytes")
