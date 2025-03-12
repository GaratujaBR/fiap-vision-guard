# FIAP VisionGuard Tech Stack Document

## Introduction

The FIAP VisionGuard project is an exciting initiative designed to create a Minimum Viable Product (MVP) for detecting dangerous cutting objects such as knives and scissors. Using artificial intelligence, the system processes pre-recorded videos to identify these objects and promptly sends an alert (via email, SMS, or even a phone call) to a central security unit. This document explains the chosen technologies in a way that anyone can follow, focusing on how each component supports the goal of quick, reliable detection in a practical test environment.

## Frontend Technologies

For the user interface, we have chosen a simple web-based approach built using Flask, a lightweight Python framework. The design is clean and minimal, helping users easily upload videos and view logs of the detection process. Although the UI is straightforward due to the project's educational focus, it is carefully crafted to be both elegant and intuitive. This simplicity ensures that users can follow the video upload and visualization of alerts without needing a deep technical background.

## Backend Technologies

The core of the project relies on powerful backend tools developed with Python. TensorFlow is used to build and train the artificial intelligence model that identifies objects of interest. OpenCV, another advanced library, works hand in hand with TensorFlow by processing videos, extracting frames, and applying computer vision techniques for object analysis. Meanwhile, Flask not only supports the frontend but also manages basic server endpoints such as video uploads and status updates. Together, these backend components create a streamlined environment for training, testing, and executing the detection model.

## Infrastructure and Deployment

For training and running the AI model, Google Colab is the platform of choice. This cloud-based environment provides the extra computational power needed without the complexity of managing your own servers. Google Colab allows us to experiment quickly and efficiently, making it easier to iterate the model based on real test data. Additionally, GitHub is used for version control and collaborative development, ensuring that the entire project's codebase is well-organized and easily shareable. This combination of tools contributes to a development process that is both reliable and scalable for future iterations.

## Third-Party Integrations

To assist in the efficiency and organization of the code, the project leverages WindSurf, a modern integrated development environment with AI-assisted features. WindSurf helps streamline coding practices and maintain clarity in the code structure, complementing the development efforts. When it comes to sending alerts, simple third-party services are used for email, SMS, or automated calls. These integrations simplify the alert process, ensuring that notifications are sent quickly after a dangerous object is detected, contributing significantly to the system's overall responsiveness.

## Security and Performance Considerations

While the project is primarily educational, key security measures are still taken to protect data and ensure that alerts are reliably transmitted. Access to the video processing endpoints is kept simple, with minimal authentication suitable for testing environments. Performance is crucial in this MVP; the system is optimized to process video frames rapidly and send alerts in just a few seconds. Techniques such as efficient frame extraction with OpenCV and rapid inference with TensorFlow ensure that the system remains fast and operational, even as it handles complex tasks like object detection.

## Conclusion and Overall Tech Stack Summary

In summary, the technology choices for the FIAP VisionGuard project are carefully balanced between simplicity and functionality. The frontend uses a clean Flask-based interface that enables straightforward video uploads and easy access to logs. Python forms the backbone of the backend, with TensorFlow and OpenCV working in tandem to train and execute the detection model. Google Colab provides the necessary compute power, while GitHub ensures effective version control. WindSurf serves as a supportive tool in the development process, and third-party alert integrations guarantee that notifications are sent quickly when dangerous objects are detected.

This tech stack not only aligns with the project's goals of rapid and reliable object detection but also supports an educational and iterative development process. Every technology chosen plays a clear role in ensuring that the system is both robust and easy to understand, making it an ideal solution for validating the potential of this innovative security feature.
