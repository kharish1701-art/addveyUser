
import os

file_path = 'android/app/build.gradle'
with open(file_path, 'r') as f:
    content = f.read()

target_str = "    androidResources {\n        ignoreAssetsPattern '!.svn:!.git:!.ds_store:!*.scc:!CVS:!thumbs.db:!picasa.ini:!*~'\n    }\n}"
replacement_str = """    androidResources {
        ignoreAssetsPattern '!.svn:!.git:!.ds_store:!*.scc:!CVS:!thumbs.db:!picasa.ini:!*~'
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}"""

if target_str in content:
    new_content = content.replace(target_str, replacement_str)
    with open(file_path, 'w') as f:
        f.write(new_content)
    print("Successfully updated build.gradle")
else:
    print("Target string not found, manual intervention might be needed.")
    # Fallback to try finding just the closing brace of android block if possible, but strict match is safer first.
