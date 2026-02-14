import requests, json, os, re
from bs4 import BeautifulSoup

url = "https://mrtipson.github.io/otz-builds"
results = {}
results['killers'] = {}
results['survivors'] = {}

def writeInJson(file, data):
   with open(file, 'w', encoding='utf-8') as f:
      json.dump(data, f, indent=4, ensure_ascii=False)

def sanitize_filename(filename):
    return re.sub(r'[\\/*?:"<>| ]', '_', filename)

def main():
    res = requests.get(url, )
    html = res.text
    soup = BeautifulSoup(html, "lxml")
    
    with open('backend/data.html', 'w', encoding='utf-8') as f:
        f.write(html)

    characters = soup.find_all("div", class_="character")

    for character in characters:
        name = sanitize_filename(character.find('h3', class_="characterName").text.strip())
        camp = character.find_parent()
        while camp:
            if camp.get("id") == "survivors":
                results["survivors"][name] = find_builds(character)
                for role in results["killers"][name]:
                    for perk in role.get('perks'):
                        downloadImage(perk.get('img'), f"backend/{name}/{role.get('build')}/{perk.get('name')}.png")
                break
            elif camp.get("id") == "killers":
                results["killers"][name] = find_builds(character)
                for role in results["killers"][name]:
                    for perk in role.get('perks'):
                        downloadImage(perk.get('img'), f"backend/{name}/{role.get('build')}/{perk.get('name')}.png")
                break
            camp = camp.find_parent()
    writeInJson('backend/results.json', results)


def find_builds(character):
  builds_results = []
  builds = character.find_all('div', class_='build')
  for build in builds:
    buildName = build.find('div', class_='buildName').text.strip()
    builds_results.append({"build": sanitize_filename(buildName), "perks": find_perks(build)})
  return builds_results

def find_perks(build):
    perk_results = []
    perks = build.find_all('div', class_='perkWrapper')
    for perk in perks:
        perk_results.append({
            "name": sanitize_filename(perk.find('img').get('title', '').strip()),
            "img": perk.find('img').get('src', '').strip()
        })
    return perk_results

def downloadImage(url, save_path):
    try:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        response = requests.get(url, stream=True)
        response.raise_for_status()
        with open(save_path, 'wb') as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)
    except Exception as e:
        print(f"❌ Failed to download {url}: {e}")

if __name__ == '__main__':
  main()