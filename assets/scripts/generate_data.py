import json
import random
from urllib.parse import urlparse

# Knowledge Base for High-Quality Descriptions
KNOWLEDGE_BASE = {
    "osintframework.com": {
        "name": "OSINT Framework",
        "desc": "La biblia interactiva de la inteligencia de fuentes abiertas. Un mapa mental esencial para cualquier investigador.",
        "tags": ["Framework", "Mindmap", "General"],
        "category": "Recon"
    },
    "shodan.io": {
        "name": "Shodan",
        "desc": "El motor de búsqueda para el Internet de las Cosas. Encuentra servidores, cámaras y dispositivos expuestos en segundos.",
        "tags": ["IoT", "Search Engine", "Active Recon"],
        "category": "Recon"
    },
    "censys.io": {
        "name": "Censys",
        "desc": "Visibilidad total de la superficie de ataque. Analiza certificados y hosts para descubrir infraestructura oculta.",
        "tags": ["Certificates", "Hosts", "Search Engine"],
        "category": "Recon"
    },
    "virustotal.com": {
        "name": "VirusTotal",
        "desc": "La referencia mundial para análisis de malware y URLs sospechosas. Inteligencia colectiva contra amenazas.",
        "tags": ["Malware", "Analysis", "Blue Team"],
        "category": "Blue Team"
    },
    "haveibeenpwned.com": {
        "name": "Have I Been Pwned",
        "desc": "Verifica si tus credenciales han sido comprometidas en brechas de datos masivas. Fundamental para auditorías de identidad.",
        "tags": ["Breach", "Emails", "Passwords"],
        "category": "Recon"
    },
    "maltego.com": {
        "name": "Maltego",
        "desc": "La herramienta definitiva para análisis de enlaces y minería de datos. Visualiza relaciones complejas en gráficos impresionantes.",
        "tags": ["Visualization", "Link Analysis", "Java"],
        "category": "Recon"
    },
    "burpsuite": { # Keyword match
        "name": "Burp Suite",
        "desc": "El estándar de oro para pruebas de seguridad en aplicaciones web. Intercepta, modifica y escanea tráfico HTTP como un dios.",
        "tags": ["Proxy", "Web", "Scanner"],
        "category": "Web Attacks"
    },
    "nmap.org": {
        "name": "Nmap",
        "desc": "El rey del escaneo de redes. Descubre hosts, puertos abiertos y versiones de servicios con precisión quirúrgica.",
        "tags": ["Scanner", "Network", "Discovery"],
        "category": "Network"
    },
    "wireshark.org": {
        "name": "Wireshark",
        "desc": "Analizador de protocolos de red microscópico. Si pasa por el cable, Wireshark lo ve. Esencial para forense y troubleshooting.",
        "tags": ["Sniffer", "Packet Analysis", "Forense"],
        "category": "Network"
    },
    "sqlmap.org": {
        "name": "SQLMap",
        "desc": "Automatización brutal para detectar y explotar inyecciones SQL. Toma el control de bases de datos en minutos.",
        "tags": ["SQLi", "Database", "Exploit"],
        "category": "Web Attacks"
    },
    "metasploit": { # Keyword match
        "name": "Metasploit",
        "desc": "El framework de penetración más utilizado del mundo. Valida vulnerabilidades con exploits reales.",
        "tags": ["Exploit", "Framework", "Pentest"],
        "category": "Post-Exploitation"
    },
    "ghunt": { # Keyword match
        "name": "GHunt",
        "desc": "Investigación profunda de cuentas de Google. Extrae correos, IDs, fotos y localizaciones desde un simple perfil.",
        "tags": ["Google", "Cloud", "OSINT"],
        "category": "Recon"
    },
    "sherlock": { # Keyword match
        "name": "Sherlock",
        "desc": "Caza nombres de usuario en cientos de redes sociales. Encuentra la huella digital de tu objetivo al instante.",
        "tags": ["Username", "Social Media", "CLI"],
        "category": "Recon"
    },
    "spiderfoot": { # Keyword match
        "name": "SpiderFoot",
        "desc": "Automatización OSINT masiva. Consulta cientos de fuentes de datos para crear un perfil completo de tu objetivo.",
        "tags": ["Automation", "Recon", "Framework"],
        "category": "Recon"
    },
    "theharvester": { # Keyword match
        "name": "theHarvester",
        "desc": "Recolecta emails, subdominios, hosts y nombres de empleados desde fuentes públicas. Simple y efectivo.",
        "tags": ["Emails", "Subdomains", "Recon"],
        "category": "Recon"
    },
    "inteltechniques.com": {
        "name": "IntelTechniques",
        "desc": "Recursos y herramientas de Michael Bazzell. Guías avanzadas para privacidad y OSINT profesional.",
        "tags": ["Privacy", "Guides", "Tools"],
        "category": "Recon"
    },
    "start.me": {
        "name": "Start.me Collection",
        "desc": "Colección curada de recursos y herramientas OSINT. Un punto de partida excelente para investigaciones específicas.",
        "tags": ["Collection", "Resources", "Bookmarks"],
        "category": "Recon"
    },
    "github.com": {
        "name": "GitHub Tool",
        "desc": "Repositorio de código fuente para herramientas de seguridad. Revisa el código, compila y ejecuta.",
        "tags": ["Code", "Open Source", "Dev"],
        "category": "Recon" # Default, will be refined
    }
}

# Generic Descriptions for fallback
GENERIC_DESCRIPTIONS = [
    "Recurso especializado para investigación digital y análisis de objetivos en fuentes abiertas.",
    "Herramienta esencial para ampliar tu arsenal de reconocimiento y recolección de datos.",
    "Plataforma de inteligencia para descubrir información oculta y correlacionar datos.",
    "Utilidad técnica para optimizar flujos de trabajo en pruebas de penetración y auditorías.",
    "Recurso de referencia para analistas de seguridad y equipos de Red Team.",
    "Base de datos y motor de búsqueda para encontrar activos digitales expuestos.",
    "Framework para automatizar tareas repetitivas de recolección de información.",
    "Herramienta de nicho para investigaciones específicas y análisis forense digital."
]

def get_domain(url):
    try:
        return urlparse(url).netloc.replace("www.", "")
    except:
        return ""

def generate_name(url):
    # Try to extract a readable name from URL
    parsed = urlparse(url)
    path = parsed.path.strip("/")
    domain = parsed.netloc.replace("www.", "")
    
    if "github.com" in domain:
        parts = path.split("/")
        if len(parts) >= 2:
            return parts[1].replace("-", " ").replace("_", " ").title()
    
    if "start.me" in domain:
        parts = path.split("/")
        if len(parts) >= 3: # /p/id/name
            return parts[2].replace("-", " ").replace("_", " ").title()
        
    # Fallback to domain name
    name = domain.split(".")[0].title()
    return name

def categorize_and_tag(url, name):
    url_lower = url.lower()
    name_lower = name.lower()
    
    # Defaults
    category = "Recon"
    tags = ["OSINT", "Tools"]
    
    # Logic
    if any(x in url_lower for x in ["exploit", "vuln", "attack", "injection", "xss", "sql", "payload"]):
        category = "Web Attacks"
        tags = ["Exploit", "Web", "Vuln"]
    elif any(x in url_lower for x in ["nmap", "wireshark", "net", "port", "scan", "wifi", "ip", "dns"]):
        category = "Network"
        tags = ["Network", "Scanner", "IP"]
    # Stricter matching for Blue Team to avoid "social" matching "soc"
    elif any(x in url_lower for x in ["virus", "malware", "forensic", "blue", "defen", "monitor", "siem", "threat", "soc "]):
        category = "Blue Team"
        tags = ["Defense", "Malware", "Analysis"]
    elif any(x in url_lower for x in ["shell", "backdoor", "c2", "post", "privilege", "crack", "hash"]):
        category = "Post-Exploitation"
        tags = ["Post-Exp", "Shell", "Creds"]
    elif "start.me" in url_lower:
        category = "Recon"
        tags = ["Collection", "Resources", "Bookmarks"]
    elif "github.com" in url_lower:
        tags.append("Code")
        
    # Refine tags based on specific keywords
    if "email" in url_lower: tags.append("Emails")
    if "phone" in url_lower: tags.append("Phone")
    if "social" in url_lower: tags.append("Social Media")
    if "domain" in url_lower: tags.append("Domains")
    if "image" in url_lower or "photo" in url_lower: tags.append("Images")
    if "map" in url_lower or "geo" in url_lower: tags.append("Geo")
    
    return category, tags[:4] # Max 4 tags

def normalize_url(url):
    return url.lower().strip().rstrip('/')

def process_urls(filename):
    tools = []
    seen_urls = set()
    
    # Add user's custom tools first
    tools.append({
        "id": 1,
        "name": "OsintX",
        "description": "Mi brújula personal de OSINT automatizada en Python. Integra múltiples APIs para un reconocimiento 360 grados.",
        "url": "#",
        "tags": ["Python", "Automation", "Personal", "CLI"],
        "category": "Mis Herramientas",
        "screenshot": None
    })
    
    try:
        with open(filename, 'r') as f:
            lines = f.readlines()
            
        for i, line in enumerate(lines):
            url = line.strip()
            if not url:
                continue
                
            norm_url = normalize_url(url)
            if norm_url in seen_urls:
                continue
            
            seen_urls.add(norm_url)
            domain = get_domain(url)
            
            # Check Knowledge Base
            kb_match = None
            for key in KNOWLEDGE_BASE:
                if key in url.lower():
                    kb_match = KNOWLEDGE_BASE[key]
                    break
            
            if kb_match:
                name = kb_match["name"]
                # If it's a generic KB entry (like github or start.me), try to get specific name
                if "GitHub" in name or "Start.me" in name:
                    specific_name = generate_name(url)
                    if specific_name:
                        name = specific_name
                
                desc = kb_match["desc"]
                category = kb_match["category"]
                tags = kb_match["tags"]
            else:
                name = generate_name(url)
                category, tags = categorize_and_tag(url, name)
                desc = random.choice(GENERIC_DESCRIPTIONS)
            
            tools.append({
                "id": i + 100, # Start IDs after custom tools
                "name": name,
                "description": desc,
                "url": url,
                "tags": tags,
                "category": category,
                "screenshot": None
            })
            
    except Exception as e:
        print(f"Error processing URLs: {e}")
        return []

    return tools

def main():
    tools = process_urls("urls.txt")
    
    js_content = f"""const tools = {json.dumps(tools, indent=2)};
"""
    
    with open("data.js", "w") as f:
        f.write(js_content)
    
    print(f"Successfully generated data.js with {len(tools)} tools.")

if __name__ == "__main__":
    main()
