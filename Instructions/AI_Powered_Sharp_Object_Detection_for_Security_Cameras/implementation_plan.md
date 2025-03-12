# Implementation plan

## Phase 1: Environment Setup

1.  Create the project directory structure at `/fiap_vision_guard` to house all code, documentation, and assets. *(Project Overview: Core Requirements)*

2.  Initialize a Git repository in the project folder and create `main` and `dev` branches with branch protection rules on GitHub. *(Development Considerations)*

3.  Set up a Python virtual environment ensuring Python 3.11.4 is installed. *(Tech Stack: Language)

4.  Create a `requirements.txt` file in the project root and add the following exact dependencies:

    *   TensorFlow (latest stable release compatible with your code, as no version is fixed)
    *   OpenCV
    *   Flask
    *   Any email/SMS API libraries needed (e.g., smtplib or Twilio SDK) *(Tech Stack: AI/ML, Computer Vision, Framework)*

5.  Create a Google Colab notebook named `training_model.ipynb` in a `/training` directory to document and execute the AI model training pipeline. Include dataset augmentation instructions and steps for training the TensorFlow model. *(Development Considerations & Dataset)*

## Phase 2: Frontend Development

1.  Create an `/app` directory to host the Flask web interface code. *(Project Overview: User Flow)
2.  In `/app`, create the main Flask application file `app.py`. *(Tech Stack: Framework)
3.  In `app.py`, implement the root route (`/`) that returns a rendered HTML page for video uploads. *(User Flow: Step 1)
4.  Create a templates folder at `/app/templates` and add `upload.html`, containing a form with a file input to allow users to upload pre-recorded videos. *(User Flow: Step 1 & Elegant Design)*
5.  In `upload.html`, ensure the form accepts only video file formats (e.g., MP4) and includes a submit button. *(Non-Functional Requirements: Usability)*
6.  **Validation**: Run the Flask server locally (`python app.py`) and open `http://localhost:5000` to verify that the upload page displays correctly. *(User Flow & Documentation)*

## Phase 3: Backend Development

1.  In `app.py`, add a new POST route `/process` to handle video file uploads from the upload page. *(User Flow: Step 2)
2.  Create a utility function `extract_frames(video_path)` in a new file `/app/utils/video_processing.py` that uses OpenCV to extract frames from the uploaded video file. *(User Flow: Step 2 & Tech Stack: Computer Vision)*
3.  **Validation**: Write a unit test in `/tests/test_video_processing.py` to run `extract_frames` on a sample video and verify that frames are created. *(Testing Requirement)*
4.  In the `/process` route (in `app.py`), add logic to call `extract_frames` and then pass the extracted frames to the AI model inference function. *(User Flow: Step 3)
5.  Create a new directory `/app/model` and in it create `inference.py` with a function to load the pre-trained TensorFlow model and perform inference on images. *(Tech Stack: AI/ML)
6.  In `inference.py`, implement the logic to analyze each frame for cutting objects (such as knives or scissors) and return detection results. *(Core Requirements: Object Detection)
7.  **Validation**: Test the inference function with a sample image to ensure that the model detects cutting objects within an acceptable response time. *(Success Metrics & Non-Functional Requirements)*
8.  Create an alerts module by making a directory `/app/alerts` and adding the file `alert.py` which implements a function `send_alert()` to trigger alerts via email (or SMS/phone call as desired). *(Alert System Details)*
9.  In `alert.py`, implement the alert logic using a simple and well-tested API (e.g., using Python’s smtplib for emails or Twilio SDK for SMS) ensuring alerts are sent in a few seconds. *(Core Requirements: Alert System; Q&A: Alert System Integration)
10. Modify the `/process` route to call `send_alert()` when the detection function indicates the presence of a cutting object. *(User Flow: Step 4)
11. **Validation**: Test the `/process` endpoint locally by uploading a sample video that contains a known cutting object and verify that the alert function is triggered (e.g., by checking console logs or receiving a test email/SMS). *(Success Metrics & Testing)

## Phase 4: Integration

1.  Integrate the frontend upload form with the `/process` backend endpoint by ensuring the video file is posted correctly from `upload.html` to `app.py`. *(User Flow: Step 1 & 2)
2.  Implement logging in `app.py` by writing process logs to a file at `/app/logs/process.log` so users can review processing steps and alert statuses. *(Non-Functional Requirements: Documentation & Usability)
3.  **Validation**: Conduct an end-to-end test by uploading a video from the web interface and verifying that frame extraction, model inference, and alert sending occur sequentially and successfully. *(User Flow & Success Metrics)
4.  Document the AI model training and video processing pipeline comprehensively in the `README.md` file at the project root, including references to the Google Colab notebook and key configuration details. *(Documentation Requirements)

## Phase 5: Deployment

1.  Create a `Procfile` in the project root with the content:

web: gunicorn app.app:app This prepares the app for deployment using Gunicorn. *(Deployment Considerations)

1.  Create a production configuration file (e.g., `/config/production.cfg`) to manage environment variables such as alert service credentials and model paths. *(Non-Functional Requirements: Security & Documentation)
2.  **Validation**: Deploy the Flask app locally using Gunicorn (`gunicorn app.app:app`) and run an end-to-end test to confirm all routes and functionalities work as expected. *(User Flow & Testing)
3.  Finalize project documentation, including a video demonstration (max 15 minutes) showcasing the upload process, object detection, and alert triggering, and update the GitHub repository with comprehensive instructions. *(Project Overview: Documentation & Elegant Design)

Note: All code development will be assisted by Windsurf (an AI-assisted IDE) and model training/execution will use Google Colab, which is indicated in the project requirements. Ensure that each component, from dataset preparation and model training to the alert system and Flask app, is validated individually before full integration.
