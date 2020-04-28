# tested with Python 3.8.2

import requests
from bs4 import BeautifulSoup

final_chapter = 2

chap_numbers = range(1, final_chapter + 1)
print(chap_numbers)
for chap_number in chap_numbers:
    html = ''
    response = requests.get('https://en.wikibooks.org/wiki/Salute,_Jonathan!/Capitul_' + str(chap_number))
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Remove the wikipedia edit buttons
    for tag in soup.find_all(class_='mw-editsection'):
        tag.decompose()

    # First and Last h2's are not meaningful content
    content_headings = soup.find_all('h2')[1:-1]

    for heading in content_headings:

        html += heading.prettify()
        for sibling in heading.find_next_siblings():
            if sibling.name == 'h2':
                break
            html += sibling.prettify()
    
    with open('./HTMLbook/' + str(chap_number) + '.html', 'w', encoding='utf-8') as chapter_file:
        chapter_file.write(html)

print('done')