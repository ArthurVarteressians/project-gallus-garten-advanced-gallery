@echo off
setlocal enabledelayedexpansion

:: Set the folder where images are located (use double quotes here)
set "image_folder=C:\Images"

:: Set the output file path (use double quotes here)
set "output_file=C:\Images\images.json"

:: Initialize the output JSON array
echo [ > "%output_file%"

:: Counter to handle publicId increment
set /a counter=1

:: Variable to track if any images are processed
set "found_image=0"
set "first_image=1"  :: Track if it's the first image

:: Loop through each image file in the specified directory with extensions JPG, PNG, GIF, and WEBP
for %%f in ("%image_folder%\*.jpg" "%image_folder%\*.png" "%image_folder%\*.gif" "%image_folder%\*.webp") do (
    set "current_image=%%~nxf"
    set "file_extension=%%~xf"

    :: Indicate that we've found an image
    set "found_image=1"

    :: If it's not the first image, add a comma before this one
    if !first_image! equ 0 (
        echo , >> "%output_file%"
    )
    set "first_image=0"  :: After the first image, set this to 0 to add commas for future items

    :: Debugging output
    echo Found image: !current_image!

    :: Add the image information to the JSON structure
    echo { >> "%output_file%"
    echo    "name": "!current_image!", >> "%output_file%"
    echo    "description": "Description here", >> "%output_file%"
    echo    "tags": ["tag1", "tag2"], >> "%output_file%"
    echo    "url": "https://example.com/!current_image!", >> "%output_file%"
    echo    "publicId": "!counter!", >> "%output_file%"
    echo    "format": "!file_extension:~1!", >> "%output_file%"  
    echo    "views": 100, >> "%output_file%"
    echo    "likes": 20, >> "%output_file%"
    echo    "isFeatured": true, >> "%output_file%"
    echo    "isPublic": true, >> "%output_file%"
    echo    "categories": ["category1", "category2"] >> "%output_file%"
    echo } >> "%output_file%"

    :: Increment the counter
    set /a counter+=1
)

:: Check if any images were found
if "!found_image!" == "0" (
    echo No images found in the folder.
    echo [] >> "%output_file%"  :: Create an empty JSON array if no images are found
) else (
    :: Close the JSON array properly
    echo ] >> "%output_file%"
)

:end
echo JSON file created at %output_file%
pause
