# Backend Structure Document

## Introduction

The backend of our FIAP VisionGuard MVP is the engine powering the detection of cutting objects in pre-recorded videos and triggering alerts. It plays a critical role by processing uploaded videos, running them through an AI model trained with TensorFlow, and coordinating the alert system that notifies users via email, SMS, or calls. With a focus on a simplified, educational approach, the backend is built to demonstrate core functionalities without unnecessary complexity, ensuring ease of use and clear communication between different parts of the system.

## Backend Architecture

The design of our backend centers around a simple, modular approach implemented primarily in Python using the Flask framework. The architecture is designed with clarity and ease-of-maintenance in mind, allowing different components such as video processing, object detection, and alerting to communicate seamlessly. This structure supports scalability as the system grows, facilitates quick troubleshooting by keeping components loosely coupled, and maintains performance by dedicating specific segments of the code to tasks like frame extraction and model inference. By integrating proven design patterns, the backend remains both robust and adaptable for further enhancements if necessary.

## Database Management

Although our MVP is designed for quick prototype development, a basic database system is integrated to manage user data, log video uploads, and store alert activity. In this instance, a lightweight SQL database like SQLite can be used initially, allowing for structured storage and retrieval of records without significant overhead. Data is organized into tables that track user accounts, video processing logs, and alert histories. This simple setup makes data storage easy to understand while also being ready to transition to more robust systems such as PostgreSQL in future iterations if the need arises.

## API Design and Endpoints

The backend exposes several API endpoints through the Flask framework. These endpoints are built based on RESTful principles, ensuring simple and predictable interactions between the frontend and backend. Key endpoints include one for video uploads, which accepts video files and initiates processing, an endpoint to trigger and retrieve real-time alerts when cutting objects are detected, and a status endpoint to check the health and logs of the system. This structured interface allows smooth communication with the frontend while ensuring the AI detection components and alert services remain effective and timely.

## Hosting Solutions

For hosting our backend, a cloud provider environment is preferred due to its reliability and scalability. Using options such as Google Cloud’s App Engine or similar cloud services provides an environment that supports Python and Flask seamlessly. Google Colab is also utilized, particularly for training the AI model. This combination offers a cost-effective way to manage computational loads and data storage needs, ensuring the project remains accessible and efficient while complying with the educational and experimental nature of the MVP.

## Infrastructure Components

The backend infrastructure includes several essential components that work together to provide a smooth user experience. A load balancer is employed to manage incoming requests and distribute them evenly, preventing any single server from becoming overwhelmed. Caching mechanisms help speed up data retrieval for frequent tasks and minimize repetitive processing, especially for logging activity and health status checks. While a full content delivery network (CDN) is not a central requirement in this MVP, the potential integration remains open for static assets if needed later on. Collectively, these components help ensure that the backend remains responsive and efficient, even under peak testing conditions.

## Security Measures

Security is fundamental to protecting both the system and user data. In our implementation, authentication and basic authorization measures are integrated into the Flask application to secure endpoints, particularly those handling sensitive operations like video uploads and alert configurations. Data between the client and server is encrypted using HTTPS, minimizing the risk of data breaches during transmission. Additionally, sensitive operations, such as activating the alert system, incorporate further verification steps. These measures ensure that user data is protected and that the system maintains compliance with standard security practices even within this simplified educational framework.

## Monitoring and Maintenance

To ensure the smooth operation of the backend, a set of monitoring tools and practices are integrated into the system. Logging systems record detailed information about video uploads, processing tasks, and alert triggers. These logs can be reviewed periodically to detect any irregularities. Further, automated tools that check system performance and error logs are employed, making it easier to spot issues early on. Maintenance strategies include regular code reviews via GitHub and a clear workflow for updating dependencies and security patches. Together, these practices help maintain the reliability of the backend over its lifecycle.

## Conclusion and Overall Backend Summary

In summary, the backend of our FIAP VisionGuard MVP is designed to effectively process video data, identify cutting objects using an AI model, and send alerts quickly. Built using Python and Flask, it balances simplicity with functionality, ensuring that critical features are both robust and easy to maintain. The architecture supports a reliably scalable, secure, and monitorable environment while using straightforward technologies like SQLite for data management and Google Cloud for hosting. This clear and agile design not only meets the core requirements of the project but also positions the solution as a distinct, proof-of-concept system in the evolving field of automated video analysis and alerting.
