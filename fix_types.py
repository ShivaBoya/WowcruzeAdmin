import os

file_path = r'c:\Users\shiva\OneDrive\NamasteNode\Namaste React\WowCruzeAdmin\wc_adminapp-main-master-dev\src\app\core-components\add-property-page\add-property-page.component.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    # Fix the assignments to handle null/undefined and matching the required 'string' type
    if 'propertyInfo.admin_id = localStorage.getItem(\'staff_id\');' in line:
        indent = line[:line.find('propertyInfo')]
        new_lines.append(f"{indent}propertyInfo.admin_id = localStorage.getItem('staff_id') || '';\n")
    elif 'propertyInfo.staff_id = propertyInfo.admin_id;' in line:
        indent = line[:line.find('propertyInfo')]
        new_lines.append(f"{indent}propertyInfo.staff_id = propertyInfo.admin_id || '';\n")
    elif 'propertyInfo.staffId = propertyInfo.admin_id || \'\';' in line:
        new_lines.append(line) # This one is already safe but keep it
    else:
        new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
