import json
import re
import os  # <--- 1. CAMBIO IMPORTANTE: Necesitamos esto para las rutas de carpetas
from urllib.parse import urlparse

# --- CONFIGURATION ---

# New Category Mapping based on User Request
CATEGORIES = {
    "osint_general": "Fuentes y Recursos Generales de OSINT",
    "osint_platforms": "Herramientas y Plataformas OSINT",
    "domains": "Análisis de Dominio y WHOIS",
    "network": "Análisis de Infraestructura y Redes",
    "search_deep_web": "Búsqueda en Motores y Deep Web",
    "images_forensics": "Búsqueda de Imágenes y Análisis Forense",
    "social_profiles": "Análisis de Redes Sociales y Perfiles",
    "dark_web": "Investigaciones en la Web Oscura y Tor",
    "data_viz": "Análisis de Datos y Visualización",
    "security_malware": "Seguridad, Vulnerabilidades y Malware",
    "open_data": "Fuentes de Información y Datos Abiertos",
    "threat_intel": "Análisis de Amenazas y Ciberseguridad",
    "collaboration": "Comunicación y Colaboración",
    "legal": "Recursos Legales y de Investigación",
    "other": "Otros Recursos y Herramientas",
    "start_me": "Start.me Collections",
    "github_tools": "GitHub Tools"
}

# Explicit "Star Tools" with manual metadata
STAR_TOOLS = {
    "osintframework.com": {"category": "osint_general", "tags": ["Framework", "General", "Mindmap"]},
    "inteltechniques.com": {"category": "osint_general", "tags": ["Guides", "Privacy", "Tools"]},
    "maltego.com": {"category": "osint_platforms", "tags": ["Graph", "Link Analysis", "Java"]},
    "spiderfoot.net": {"category": "osint_platforms", "tags": ["Automation", "Scanner", "Recon"]},
    "shodan.io": {"category": "domains", "tags": ["IoT", "Search", "Ports"]},
    "censys.io": {"category": "domains", "tags": ["Certificates", "Hosts", "Search"]},
    "virustotal.com": {"category": "security_malware", "tags": ["Malware", "Analysis", "Antivirus"]},
    "bellingcat.com": {"category": "legal", "tags": ["Investigation", "News", "Guides"]},
    "web.archive.org": {"category": "osint_general", "tags": ["Archive", "History", "Wayback"]},
    "cyberchef.uk": {"category": "data_viz", "tags": ["Decoding", "Utility", "SwissArmyKnife"]}, 
}

# Generic Descriptions
GENERIC_DESCS = [
    "Herramienta especializada para análisis y recolección de datos.",
    "Recurso esencial para investigaciones digitales y OSINT.",
    "Utilidad para optimizar flujos de trabajo de seguridad.",
    "Plataforma para descubrir y correlacionar información pública.",
    "Base de datos para búsqueda de activos digitales.",
    "Framework para automatizar tareas de reconocimiento.",
    "Herramienta de nicho para investigaciones específicas.",
    "Recurso de referencia para analistas de inteligencia."
]

def get_domain(url):
    try:
        return urlparse(url).netloc.replace("www.", "").lower()
    except:
        return ""

def determine_category_and_tags(url, name):
    u = url.lower()
    dom = get_domain(url)
    
    # 0. Special Sections (Start.me & GitHub)
    if "start.me" in dom:
        return "start_me", ["Collection", "Bookmarks", "StartMe"]
    if "github.com" in dom or "gitlab.com" in dom:
        tags = ["Code", "Repository", "Tool"]
        if "recon" in u: tags.append("Recon")
        if "tool" in u: tags.append("In-Dev")
        return "github_tools", tags

    # 1. OSINT General
    if any(x in u for x in ["osint", "framework", "technique", "combine", "guide", "resource", "directory", "awesome"]):
        return "osint_general", ["General", "Resources", "Directory"]

    # 2. Images / Forensics
    if any(x in u for x in ["image", "foto", "photo", "face", "exif", "metadata", "forensic", "cam", "video", "deepfake"]):
        return "images_forensics", ["Images", "Forensics", "Metadata"]

    # 3. Domains / DNS
    if any(x in u for x in ["domain", "dns", "whois", "subdomain", "urlscan", "crt.sh", "viewdns", "securitytrails", "ip", "host"]):
        return "domains", ["Domain", "DNS", "Whois"]

    # 4. Social / People
    if any(x in u for x in ["username", "user", "people", "social", "email", "phone", "profile", "facebook", "twitter", "instagram", "linkedin", "hunter", "pipl"]):
        return "social_profiles", ["Social", "People", "Usernames"]
        
    # 5. Security / Malware
    if any(x in u for x in ["virus", "malware", "exploit", "cve", "vuln", "attack", "hack", "ransom", "payload", "sandbox", "any.run", "hybrid"]):
        return "security_malware", ["Security", "Malware", "Exploits"]

    # 6. Dark Web / Tor
    if any(x in u for x in ["onion", "tor", "dark", "deep", "iaca", "leak", "breach"]):
         return "dark_web", ["DarkWeb", "Tor", "Leaks"]

    # 7. Threat Intel
    if any(x in u for x in ["threat", "intel", "alienvault", "riskiq", "greynoise", "cymon", "phishtank"]):
        return "threat_intel", ["ThreatIntel", "feeds", "IOCs"]

    # 8. Data / Viz
    if any(x in u for x in ["graph", "viz", "chart", "kumu", "gephi", "data", "map", "visual"]):
        return "data_viz", ["Visualization", "Data", "Analysis"]

    # 9. Search Engines
    if any(x in u for x in ["search", "google", "bing", "yandex", "duckduckgo", "engine", "query"]):
        return "search_deep_web", ["Search", "Engine", "Query"]

    # 10. Network / Infra
    if any(x in u for x in ["network", "net", "bgp", "ripe", "port", "scan", "wifi"]):
        return "network", ["Network", "Infra", "Ports"]

    # 11. Open Data / Gov
    if any(x in u for x in ["gov", "worldbank", "cia", "factbook", "stats", "public", "record"]):
        return "open_data", ["OpenData", "Gov", "Records"]

    # 12. Legal / Investigative
    if any(x in u for x in ["court", "legal", "justice", "news", "journalism", "bellingcat", "verification"]):
        return "legal", ["Legal", "Investigative", "News"]

    # 13. Collaboration
    if any(x in u for x in ["note", "pad", "bin", "paste", "crypt", "mail", "proton", "tutanota", "collab"]):
        return "collaboration", ["Collaboration", "Secure", "Notes"]
        
    # 14. Platforms
    if any(x in u for x in ["tool", "platform", "suite"]):
        return "osint_platforms", ["Platform", "Suite"]

    # Fallback
    return "other", ["Tool", "Utility"]

def format_name(url):
    domain = get_domain(url)
    parts = domain.split('.')
    name = domain
    
    if len(parts) >= 2:
        base = parts[:-1]
        if base[-1] in ["co", "com", "org", "net", "io", "gov", "edu"]:
            base = base[:-1]
        
        longest = max(parts, key=len)
        if longest in ["github", "start", "docs", "drive"]:
             path = urlparse(url).path
             if path and len(path) > 1:
                 segs = [s for s in path.strip('/').split('/') if s]
                 if segs:
                     name = segs[-1].replace('-', ' ').replace('_', ' ')
        else:
             name = longest
             
    return name.replace("www", "").title()

def process():
    tools = []
    seen_urls = set()
    
    # --- 2. CAMBIO: Lectura segura con UTF-8 ---
    # Since script is in /scripts, and urls.txt is in root (parent)
    input_path = os.path.join('..', 'urls.txt')
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            raw_urls = [line.strip() for line in f.readlines() if line.strip()]
    except FileNotFoundError:
        print(f"❌ Error: No se encuentra 'urls.txt' en la carpeta superior ({input_path}).")
        return

    import random
    
    # --- BLUE TEAM FIX: URL Sanitization ---
    def sanitize_url(u):
         # Remove dangerous chars
         return re.sub(r'[<>"\'\s]', '', u)

    for url in raw_urls:
        if not url.startswith("http"): continue
        
        # Sanitize
        clean_url = sanitize_url(url)
        norm_url = clean_url.rstrip('/')
        
        if norm_url in seen_urls: 
            continue
        seen_urls.add(norm_url)
        
        domain = get_domain(clean_url)
        
        match_key = None
        for key in STAR_TOOLS:
            if key in domain:
                match_key = key
                break
        
        name = format_name(clean_url)
        
        if match_key:
            data = STAR_TOOLS[match_key]
            cat = data['category']
            tags = data['tags']
            desc = GENERIC_DESCS[1]
        else:
            cat, tags = determine_category_and_tags(clean_url, name)
            desc = random.choice(GENERIC_DESCS)

        tools.append({
            "category": cat,
            "name": name,
            "description": desc,
            "url": clean_url,
            "tags": tags,
            "screenshot": ""
        })

    tools.sort(key=lambda x: x['name'])
    
    # --- 3. CAMBIO: Ruta de salida a la carpeta ROOT ---
    js_content = f"window.tools = {json.dumps(tools, indent=2)};"
    
    # Esto sube un nivel (..) y escribe data.js en root
    output_path = os.path.join('..', 'data.js') 
    
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print(f"✅ ÉXITO: Se generaron {len(tools)} herramientas en: {output_path}")
    except FileNotFoundError:
        print(f"❌ Error: No se encontró la ruta {output_path}.")

if __name__ == "__main__":
    process()
