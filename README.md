S.A.F.E. Rail – AI-Powered Child Detection System for Indian Railway Stations
“What if the next time a child goes missing at a railway station... AI sees them before the trafficker does?”

S.A.F.E. Rail (Secure AI For Every Rail) is an AI-powered child safety and detection system built specifically for Indian railway stations. It aims to address the urgent issue of missing, runaway, or trafficked children in crowded public transport environments using intelligent, real-time video surveillance.
![image](https://github.com/user-attachments/assets/885bf55d-35d6-411a-911f-e3f620b5b081)
![image](https://github.com/user-attachments/assets/fa5e096e-8e09-4fcc-bd70-bb2a2079326c)
![image](https://github.com/user-attachments/assets/800ee19f-d55e-4968-a9d9-673db30d5378)
![image](https://github.com/user-attachments/assets/712f08d8-2bd9-48b7-9eb0-24db672afeb0)
![WhatsApp Image 2025-07-04 at 15 52 50_6f4c5a32](https://github.com/user-attachments/assets/83d04c82-0a20-4906-a55d-c86dd7632800)
![WhatsApp Image 2025-07-04 at 15 52 03_f9524039](https://github.com/user-attachments/assets/4db1e259-feaa-4798-a141-771f51bd68b4)

Features
Facial Recognition
Accurately identifies children from uploaded or captured images. The system is designed to work even in low-resolution, crowded, or noisy visual conditions, typical of Indian railway environments.

Real-Time CCTV Feed Analysis
Monitors existing CCTV infrastructure across railway stations. It continuously scans and analyzes video streams to detect and track potential child subjects across platforms, waiting areas, entrances, and exits.

Age and Gender-Based Filtering
Improves accuracy by allowing optional metadata input (such as estimated age and gender) to reduce false positives and increase detection relevance.

Instant Alert System
Automatically notifies Railway Protection Force (RPF), child helpline networks, and designated railway officials upon detecting a potential match. Alerts include location details, video timestamps, and confidence levels of identification.

How It Works
Input: A missing child’s image is submitted via the system dashboard.

Detection: The AI model analyzes live CCTV feeds and searches for visual matches.

Filtering: Age and gender filters are optionally applied to improve precision.

Alerting: Upon a potential match, authorities are immediately notified with evidence for human verification.

Verification: Verified alerts are escalated for rapid response.

Getting Started
Prerequisites
Python 3.8+

Access to CCTV feed or sample video input

A GPU is recommended for real-time processing but not mandatory

Installation
Clone the repository and install dependencies:

bash
Copy
Edit
git clone https://github.com/yourusername/safe-rail.git
cd safe-rail
pip install -r requirements.txt
Run the System
Use the following command to begin analysis:

css
Copy
Edit
python main.py --video_source <path_or_stream_url> --input_image <path_to_child_image>
