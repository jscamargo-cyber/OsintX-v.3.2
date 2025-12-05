import json
import re

# Paths
DATA_JS_PATH = '/home/secd3arkbpm/Escritorio/APP WEB/data.js'
NEW_TOOLS_PATH = '/home/secd3arkbpm/Escritorio/APP WEB/new_tools.json'

def load_data_js(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract JSON array from "const tools = [...]"
    match = re.search(r'const tools = (\[.*\]);', content, re.DOTALL)
    if not match:
        raise ValueError("Could not find 'const tools = [...]' in data.js")
    
    json_str = match.group(1)
    # Fix trailing commas if any (JS allows them, JSON doesn't)
    json_str = re.sub(r',\s*]', ']', json_str)
    json_str = re.sub(r',\s*}', '}', json_str)
    
    return json.loads(json_str)

def save_data_js(path, tools):
    json_str = json.dumps(tools, indent=2, ensure_ascii=False)
    content = f"const tools = {json_str};\n"
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    print("Loading existing data...")
    try:
        existing_tools = load_data_js(DATA_JS_PATH)
    except Exception as e:
        print(f"Error loading data.js: {e}")
        return

    print("Loading new tools...")
    with open(NEW_TOOLS_PATH, 'r', encoding='utf-8') as f:
        new_tools = json.load(f)

    # Deduplication logic
    existing_urls = {t.get('url', '').lower().rstrip('/') for t in existing_tools}
    existing_names = {t.get('name', '').lower() for t in existing_tools}
    
    added_count = 0
    
    for tool in new_tools:
        url = tool.get('url', '').lower().rstrip('/')
        name = tool.get('name', '').lower()
        
        if url in existing_urls or name in existing_names:
            print(f"Skipping duplicate: {tool['name']}")
            continue
            
        # Add new tool
        # Ensure screenshot field exists
        if 'screenshot' not in tool:
            tool['screenshot'] = ""
            
        existing_tools.append(tool)
        existing_urls.add(url)
        existing_names.add(name)
        added_count += 1

    # Sort by category then name
    existing_tools.sort(key=lambda x: (x.get('category', ''), x.get('name', '')))

    print(f"Adding {added_count} new tools...")
    save_data_js(DATA_JS_PATH, existing_tools)
    print("Done!")

if __name__ == "__main__":
    main()
