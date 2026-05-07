import os

file_path = r'c:\Users\shiva\OneDrive\NamasteNode\Namaste React\WowCruzeAdmin\wc_adminapp-main-master-dev\src\app\core-components\add-property-page\add-property-page.component.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if 'propertyInfo.staff_id = propertyInfo.admin_id;' in line:
        new_lines.append(line)
        # Check if it's the one at the end of getUpdatePropertyAPIJSON
        # We can just add it to both since they both return propertyInfo
        indent = line[:line.find('propertyInfo')]
        new_lines.append(f"{indent}propertyInfo.staffId = propertyInfo.admin_id || '';\n")
    else:
        new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
