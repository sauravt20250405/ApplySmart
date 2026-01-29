# Exam Rules Backend - Synced with Frontend
# This file should match exam-rules.ts from frontend

def get_exam_violations(analysis_data, exam_type):
    """Get violations based on analysis data"""
    violations = []

    # Simple violation detection based on analysis
    if analysis_data.get('faces_detected', 0) == 0:
        violations.append('no_face_detected')

    if analysis_data.get('quality_score', 0) < 50:
        violations.append('low_quality')

    if analysis_data.get('text_regions', 0) < 2:
        violations.append('insufficient_text')

    return violations

def get_rule_set(exam_type, year):
    """Get rule set for specific exam"""
    
    if exam_type == 'NDA' and year == 2026:
        return NDA_2026_RULES
    elif exam_type == 'JEE' and year == 2026:
        return JEE_2026_RULES
    else:
        return None

# NDA 2026 Rules
NDA_2026_RULES = {
    'examType': 'NDA',
    'year': 2026,
    'version': '2.1.0',
    'lastUpdated': '2026-01-28',
    'applicationTimeline': {
        'notificationDate': '2026-01-XX',
        'applicationStart': '2026-01-XX',
        'applicationEnd': '2026-02-XX',
        'examDate1': '2026-04-XX',
        'examDate2': '2026-09-XX',
        'admitCard': '2026-XX-XX',
        'result': '2026-XX-XX'
    },
    'eligibilityCriteria': {
        'nationality': 'Indian citizen, or subject of Nepal/Bhutan, or Tibetan refugee',
        'ageLimit': {
            'min': 16.5,
            'max': 19.5,
            'birthDateRange': '2 Jul 2007 to 1 Jan 2011'
        },
        'maritalStatus': 'Unmarried male and female candidates only',
        'education': {
            'armyWing': '12th Class pass or appearing',
            'airForceNavy': '12th Class with Physics & Maths or appearing'
        }
    },
    'requirements': [
        {
            'id': 'nda-photo',
            'name': 'Passport Size Photograph',
            'type': 'photo',
            'required': True,
            'description': 'Recent color photo (within 3 months), 80% face coverage, frontal view, white/off-white background',
            'rules': [
                {
                    'id': 'photo-dimension',
                    'category': 'dimension',
                    'name': 'Pixel Dimension',
                    'description': 'Photo must be 350-500 pixels (width/height)',
                    'ruleReference': 'UPSC NDA 2026 Notice',
                    'validator': 'dimensionValidator',
                    'parameters': {'minPx': 350, 'maxPx': 500, 'tolerance': 10},
                    'autoCorrect': True
                },
                {
                    'id': 'photo-dpi',
                    'category': 'dpi',
                    'name': 'Resolution Check',
                    'description': 'Minimum 96 DPI, clear & sharp image',
                    'ruleReference': 'UPSC Technical Guidelines',
                    'validator': 'dpiValidator',
                    'parameters': {'minDpi': 96},
                    'autoCorrect': True
                },
                {
                    'id': 'photo-size',
                    'category': 'fileSize',
                    'name': 'File Size Check',
                    'description': 'Photo must be 20KB - 100KB',
                    'ruleReference': 'UPSC NDA 2026 Notice',
                    'validator': 'fileSizeValidator',
                    'parameters': {'minSize': 20480, 'maxSize': 102400},
                    'autoCorrect': True
                },
                {
                    'id': 'photo-format',
                    'category': 'format',
                    'name': 'File Format Check',
                    'description': 'JPG/JPEG format only',
                    'ruleReference': 'UPSC NDA 2026 Notice',
                    'validator': 'formatValidator',
                    'parameters': {'allowedFormats': ['image/jpeg', 'image/jpg']},
                    'autoCorrect': True
                },
                {
                    'id': 'photo-background',
                    'category': 'background',
                    'name': 'Background Check',
                    'description': 'Plain white/light background, no shadows/patterns',
                    'ruleReference': 'UPSC NDA 2026 Notice',
                    'validator': 'backgroundValidator',
                    'parameters': {'allowedColors': ['white', 'off-white'], 'uniformity': 0.9},
                    'autoCorrect': True
                },
                {
                    'id': 'photo-face',
                    'category': 'content',
                    'name': 'Face Detection',
                    'description': '80% face coverage, eyes open, neutral expression',
                    'ruleReference': 'UPSC NDA 2026 Notice',
                    'validator': 'faceDetectionValidator',
                    'parameters': {'minFaceSize': 0.8, 'frontal': True, 'eyesOpen': True},
                    'autoCorrect': False
                }
            ]
        },
        {
            'id': 'nda-signature',
            'name': 'Signature',
            'type': 'signature',
            'required': True,
            'description': 'Black/blue ink on white paper, clear signature',
            'rules': [
                {
                    'id': 'sig-dimension',
                    'category': 'dimension',
                    'name': 'Pixel Dimension',
                    'description': 'Signature must be 350-500 pixels (width/height)',
                    'ruleReference': 'UPSC NDA 2026 Notice',
                    'validator': 'dimensionValidator',
                    'parameters': {'minPx': 350, 'maxPx': 500, 'tolerance': 10},
                    'autoCorrect': True
                },
                {
                    'id': 'sig-size',
                    'category': 'fileSize',
                    'name': 'File Size Check',
                    'description': 'Signature must be 20KB - 100KB',
                    'ruleReference': 'UPSC NDA 2026 Notice',
                    'validator': 'fileSizeValidator',
                    'parameters': {'minSize': 20480, 'maxSize': 102400},
                    'autoCorrect': True
                },
                {
                    'id': 'sig-format',
                    'category': 'format',
                    'name': 'File Format Check',
                    'description': 'JPG/JPEG format only',
                    'ruleReference': 'UPSC NDA 2026 Notice',
                    'validator': 'formatValidator',
                    'parameters': {'allowedFormats': ['image/jpeg', 'image/jpg']},
                    'autoCorrect': True
                },
                {
                    'id': 'sig-background',
                    'category': 'background',
                    'name': 'Background Check',
                    'description': 'Plain white background only',
                    'ruleReference': 'UPSC NDA 2026 Notice',
                    'validator': 'backgroundValidator',
                    'parameters': {'allowedColors': ['white'], 'uniformity': 0.95},
                    'autoCorrect': True
                }
            ]
        },
        {
            'id': 'nda-10th-marksheet',
            'name': '10th Marksheet',
            'type': 'document',
            'required': True,
            'description': 'Matriculation certificate (mandatory for age proof)',
            'rules': [
                {
                    'id': '10th-size',
                    'category': 'fileSize',
                    'name': 'File Size',
                    'description': 'Max 1MB',
                    'validator': 'fileSizeValidator',
                    'parameters': {'maxSize': 1048576},
                    'autoCorrect': False
                }
            ]
        }
    ],
    'documentNaming': {
        'pattern': '{EXAM}_{TYPE}_{ROLLNO}_{YYYY}_{CANDIDATE_NAME}.jpg',
        'examples': [
            'NDA_PHOTO_AB123456_2026_RAHUL_SHARMA.jpg',
            'NDA_SIGNATURE_AB123456_2026_RAHUL_SHARMA.jpg'
        ],
        'autoGenerate': True
    },
    'examCenters': 'All major cities across India (select during Part-II)',
    'helpline': {
        'email': 'upsc-help@nic.in',
        'phone': '011-23385271, 011-23381125',
        'website': 'https://upsc.gov.in'
    }
}

# JEE 2026 Rules
JEE_2026_RULES = {
    'examType': 'JEE',
    'year': 2026,
    'version': '2.1.0',
    'lastUpdated': '2025-11-20',
    'requirements': [
        {
            'id': 'jee-photo',
            'name': 'Passport Size Photograph',
            'type': 'photo',
            'required': True,
            'rules': [
                {
                    'id': 'photo-dimension',
                    'category': 'dimension',
                    'name': 'Dimension Check',
                    'description': 'Photo must be 3.5cm x 4.5cm',
                    'ruleReference': 'JEE Guidelines 2026 - Section 5.1',
                    'validator': 'dimensionValidator',
                    'parameters': {'width': 3.5, 'height': 4.5, 'unit': 'cm', 'tolerance': 0.05},
                    'autoCorrect': True
                },
                {
                    'id': 'photo-dpi',
                    'category': 'dpi',
                    'name': 'DPI/Resolution Check',
                    'description': 'Photo must be 300 DPI',
                    'ruleReference': 'JEE Guidelines 2026 - Section 5.2',
                    'validator': 'dpiValidator',
                    'parameters': {'minDpi': 300},
                    'autoCorrect': True
                },
                {
                    'id': 'photo-size',
                    'category': 'fileSize',
                    'name': 'File Size Check',
                    'description': 'Photo file size must be between 10KB and 200KB',
                    'ruleReference': 'JEE Guidelines 2026 - Section 5.3',
                    'validator': 'fileSizeValidator',
                    'parameters': {'minSize': 10240, 'maxSize': 204800},
                    'autoCorrect': True
                },
                {
                    'id': 'photo-format',
                    'category': 'format',
                    'name': 'File Format Check',
                    'description': 'Photo must be in JPEG or PNG format',
                    'ruleReference': 'JEE Guidelines 2026 - Section 5.4',
                    'validator': 'formatValidator',
                    'parameters': {'allowedFormats': ['image/jpeg', 'image/jpg', 'image/png']},
                    'autoCorrect': True
                },
                {
                    'id': 'photo-background',
                    'category': 'background',
                    'name': 'Background Check',
                    'description': 'Photo must have plain white background',
                    'ruleReference': 'JEE Guidelines 2026 - Section 5.5',
                    'validator': 'backgroundValidator',
                    'parameters': {'allowedColors': ['white'], 'uniformity': 0.9},
                    'autoCorrect': True
                }
            ]
        }
    ],
    'documentNaming': {
        'pattern': '{ROLLNO}_{TYPE}.jpg',
        'example': '123456789_PHOTO.jpg'
    }
}