import os

def normalize(url):
    return url.strip().rstrip('/')

def load_urls(filename):
    if not os.path.exists(filename):
        return []
    with open(filename, 'r') as f:
        return [normalize(line) for line in f if line.strip().startswith('http')]

def main():
    existing_urls = load_urls('urls.txt')
    new_raw_urls = load_urls('new_urls_raw.txt')
    
    existing_set = set(existing_urls)
    new_unique_added = []
    
    # Track duplicates within the new list itself
    seen_in_new = set()
    self_duplicates_in_request = []
    
    duplicates_existing = []
    
    for url in new_raw_urls:
        if url in seen_in_new:
            self_duplicates_in_request.append(url)
            continue
        seen_in_new.add(url)
        
        if url in existing_set:
            duplicates_existing.append(url)
        else:
            new_unique_added.append(url)
            existing_set.add(url)
            
    # Write updated urls.txt
    all_urls = existing_urls + new_unique_added
    with open('urls.txt', 'w') as f:
        for url in all_urls:
            f.write(url + '\n')
            
    # Generate Report
    print("=== INTEGRATION REPORT ===")
    print(f"Total New URLs Provided: {len(new_raw_urls)}")
    print(f"Tools Added: {len(new_unique_added)}")
    print(f"Duplicates (Already Existing): {len(duplicates_existing)}")
    print(f"Duplicates (Internal to Request): {len(self_duplicates_in_request)}")
    print("\n--- Tools Added ---")
    for url in new_unique_added:
        print(f"[ADDED] {url}")
        
    print("\n--- Duplicates (Already in Database) ---")
    # Show first 10
    for url in duplicates_existing[:10]:
        print(f"[DUP-EXISTING] {url}")
    if len(duplicates_existing) > 10:
        print(f"... and {len(duplicates_existing) - 10} more.")

    print("\n--- Duplicates (Repeated in Request) ---")
    for url in self_duplicates_in_request[:10]:
        print(f"[DUP-REQUEST] {url}")
    if len(self_duplicates_in_request) > 10:
        print(f"... and {len(self_duplicates_in_request) - 10} more.")

if __name__ == "__main__":
    main()
