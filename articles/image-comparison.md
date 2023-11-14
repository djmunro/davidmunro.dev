---
date: 2023-11-14
title: Image Comparison Library (Python)
---

You can find the repository for this project [here](https://github.com/djmunro/image-comparison).

## Overview

This Python library provides a set of tools for image comparison, especially useful for screenshot comparison testing in environments with limited testing hooks. It's built on top of the Pillow library, with additional use of numpy and opencv-python (cv2) for more advanced image processing.

### Key Features

1. Initialization: The ComparisonImageLibrary class can be initialized with either a file path or an image object. This flexibility allows direct loading from files or manipulation of already loaded images.

2. Image Properties and Conversion:

- Properties like width, height, and image provide easy access to the image dimensions and the image object itself.
- The to_bytes method converts the image into a byte string, facilitating further processing or storage.

3. Image Manipulation:

- The crop method allows for cropping a portion of the image, useful for focusing on specific areas during comparison.
- The pixel method returns the color of a specific pixel, aiding in detailed image analysis.

4. Image Comparison:

- The same_as method compares the current image with another, determining similarity based on a set percentage threshold.
- The difference method quantitatively assesses the difference between two images.
- The part_of method checks if the current image is a sub-image of another, returning the match location and percentage.

5. Image Saving: The save method allows for writing the image to a file, supporting different formats.

## Usage Scenarios

This library is particularly useful for automated screenshot testing in environments where direct hooks into the product are unavailable. By comparing screenshots against expected images, it can validate UI changes or detect anomalies.

## Testing

The library includes inline doctest examples, demonstrating usage and validating functionality.

## Design Considerations

- The library is designed for ease of use, with methods closely mirroring typical image processing tasks.
- It employs a combination of simple Pillow operations and more advanced techniques using numpy and cv2, balancing simplicity with powerful image analysis capabilities.
