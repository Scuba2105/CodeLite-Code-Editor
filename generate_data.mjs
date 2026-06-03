import fs from 'fs';
import path from 'path';

// Master blueprint defining 3-4 representative clinical device templates per department type
const clinicalBlueprints = {
  'DEP-ICU': [
    { title: 'Puritan Bennett 980 Ventilator', category: 'Life Support', manufacturer: 'Medtronic', vendor: 'Medtronic', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'pb980.png', notes: 'High-acuity wall-tethered ventilation unit.', count: 30 },
    { title: 'IntelliVue MX800 Bedside Patient Monitor', category: 'Patient Monitoring', manufacturer: 'Philips Healthcare', vendor: 'Philips Healthcare', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'mx800.png', notes: 'Critical care high-definition monitoring matrix.', count: 30 },
    { title: 'Alaris 8100 Infusion Pump', category: 'Therapeutic Delivery', manufacturer: 'Becton Dickinson', vendor: 'BD Australia', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'alaris8100.png', notes: 'Syringe guardrails software enabled.', count: 100 },
    { title: 'Xenios Console ECMO System', category: 'Life Support', manufacturer: 'Fresenius Medical', vendor: 'Device Technologies', agent: 'Device Tech Field Service', image_path: 'xenios.png', notes: 'Advanced extracorporeal membrane oxygenation module.', count: 3 },
    { title: 'Prismax System CRRT Machine', category: 'Therapeutic Delivery', manufacturer: 'Baxter', vendor: 'Baxter Healthcare ANZ', agent: 'Baxter Corporate Engineering', image_path: 'prismax.png', notes: 'Continuous renal replacement therapy configuration.', count: 5 },
    { title: 'Hamilton T1 Transport Ventilator', category: 'Life Support', manufacturer: 'Hamilton Medical', vendor: 'Device Technologies', agent: 'Device Tech Field Service', image_path: 'hamilton_t1.png', notes: 'Portable transport ventilator for intra-hospital transfers.', count: 4 },
    { title: 'Airvo 2 Humidified High Flow System', category: 'Therapeutic Delivery', manufacturer: 'Fisher & Paykel Healthcare', vendor: 'Fisher & Paykel ANZ', agent: 'Fisher & Paykel Field Service', image_path: 'airvo2.png', notes: 'High flow nasal cannula respiratory support system.', count: 6 },
    { title: 'Intellivue X3 Mobile Patient Monitor', category: 'Patient Monitoring', manufacturer: 'Philips Healthcare', vendor: 'Philips Healthcare', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'x3.png', notes: 'Mobile monitoring unit for flexible bedside use.', count: 30 },
    { title: 'Mindray R12 ECG', category: 'Cardiology Diagnostic', manufacturer: 'Mindray', vendor: 'Mindray Australia', agent: 'Mindray Field Service', image_path: 'mindray_r12.png', notes: '12-lead electrocardiogram machine.', count: 2 },
    { title: 'CX50 Ultrasound System', category: 'Diagnostic Imaging', manufacturer: 'Philips Healthcare', vendor: 'Philips Healthcare', agent: 'Philips Field Service', image_path: 'cx50.png', notes: 'Compact ultrasound system for critical care imaging.', count: 2 },
    { title: 'Mindray TE7', category: 'Diagnostic Imaging', manufacturer: 'Mindray', vendor: 'Mindray Australia', agent: 'Mindray Field Service', image_path: 'mindray_te7.png', notes: 'Compact ultrasound system for critical care imaging.', count: 2 },
    { title: '950ANZ Humidifier', category: 'Therapeutic Climate', manufacturer: 'Fisher & Paykel Healthcare', vendor: 'Fisher & Paykel ANZ', agent: 'Fisher & Paykel Field Service', image_path: '950anz.png', notes: 'Active humidification system for ventilator circuits.', count: 30 },
    { title: 'Cocoon CWS5000 Patient Warmer', category: 'Therapeutic Climate', manufacturer: 'Cocoon', vendor: 'Care Essentials', agent: 'Care Essentials', image_path: 'bair_hugger.png', notes: 'Convective temperature management tracking attached.', count: 12 },
    { title: 'Arctic Sun 5000 Temperature Management System', category: 'Therapeutic Climate', manufacturer: 'Becton Dickinson', vendor: 'BD Australia', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'arctic_sun_5000.png', notes: 'Target temperature management system utilizing hydrogel pads for precise thermal regulation.', count: 4 },
    { title: 'INVOS 5100C Cerebral Oximeter', category: 'Patient Monitoring', manufacturer: 'Medtronic', vendor: 'Medtronic', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'invos_5100c.png', notes: 'Dual-channel near-infrared spectroscopy console for regional cerebral oxygenation tracking.', count: 6 },
    { title: 'Zoll R Series ALS Defibrillator', category: 'Emergency Response', manufacturer: 'Zoll Medical', vendor: 'Zoll Medical Australia', agent: 'Zoll Medical Australia', image_path: 'zoll_r_series.png', notes: 'Crash cart manual defibrillator with external pacing and advisory options.', count: 4 }
  ],
  'DEP-ED': [
    { title: 'Zoll X Series Advanced Defibrillator', category: 'Emergency Response', manufacturer: 'Zoll Medical', vendor: 'Zoll Medical Australia', agent: 'Zoll Factory Authorized Service', image_path: 'zoll_x.png', notes: 'Crash cart standby layout with telemetry transmission.', count: 5 },
    { title: 'IntelliVue MX700 Bedside Patient Monitor', category: 'Patient Monitoring', manufacturer: 'Philips Healthcare', vendor: 'Philips Healthcare', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'mx700.png', notes: 'Emergency department rapid assessment monitor.', count: 30 },
    { title: 'Sonosite PX Ultrasound System', category: 'Diagnostic Imaging', manufacturer: 'FUJIFILM Sonosite', vendor: 'Sonosite Australasia', agent: 'Sonosite Field Care', image_path: 'sonosite_px.png', notes: 'Point-of-care rapid fast scan mobile machine.', count: 2 },
    { title: 'Mindray R12 ECG', category: 'Cardiology Diagnostic', manufacturer: 'Mindray', vendor: 'Mindray Australia', agent: 'Mindray Field Service', image_path: 'mindray_r12.png', notes: '12-lead electrocardiogram machine.', count: 2 },
    { title: 'Mindray TE7', category: 'Diagnostic Imaging', manufacturer: 'Mindray', vendor: 'Mindray Australia', agent: 'Mindray Field Service', image_path: 'mindray_te7.png', notes: 'Compact ultrasound system for rapid assessment imaging.', count: 2 },
    { title: 'Belmont RI-2 Rapid Infuser', category: 'Therapeutic Delivery', manufacturer: 'Belmont Medical Technologies', vendor: 'Belmont ANZ', agent: 'Belmont Field Service', image_path: 'belmont_rapid_infuser.png', notes: 'High-volume rapid blood and fluid resuscitation system.', count: 1 },
    { title: 'Intellivue X3 Mobile Patient Monitor', category: 'Patient Monitoring', manufacturer: 'Philips Healthcare', vendor: 'Philips Healthcare', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'x3.png', notes: 'Mobile monitoring unit for flexible bedside use.', count: 30 },
    { title: 'Airvo 3 Humidified High Flow System', category: 'Therapeutic Delivery', manufacturer: 'Fisher & Paykel Healthcare', vendor: 'Fisher & Paykel ANZ', agent: 'Fisher & Paykel Field Service', image_path: 'airvo3.png', notes: 'High flow nasal cannula respiratory support system.', count: 4 },
    { title: 'BM900 Slit Lamp', category: 'Diagnostic', manufacturer: 'Haag-Streit', vendor: 'Haag-Streit Australia', agent: 'Haag-Streit Field Service', image_path: 'bm900.png', notes: 'Ophthalmic diagnostic slit lamp for eye examinations.', count: 1 },
    { title: 'Welch Allyn CSM Spot Monitor', category: 'Patient Monitoring', manufacturer: 'Hillrom / Welch Allyn', vendor: 'Welch Allyn Australia', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'wa_csm.png', notes: 'Mobile vital signs monitor for rapid triage assessment.', count: 5 },
    { title: 'Welch Allyn GS777 Diagnostic Set', category: 'Diagnostic', manufacturer: 'Hillrom / Welch Allyn', vendor: 'Welch Allyn Australia', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'gs777.png', notes: 'Mobile diagnostic set with otoscope and ophthalmoscope.', count: 5 },
    { title: 'Hamilton T1 Transport Ventilator', category: 'Life Support', manufacturer: 'Hamilton Medical', vendor: 'Device Technologies', agent: 'Device Tech Field Service', image_path: 'hamilton_t1.png', notes: 'Portable transport ventilator for intra-hospital transfers.', count: 4 },
    { title: 'Lucas 3 Chest Compression System', category: 'Emergency Response', manufacturer: 'Stryker', vendor: 'Stryker Australia', agent: 'Stryker Field Service', image_path: 'lucas3.png', notes: 'Automated mechanical chest compression device for cardiac arrest resuscitation.', count: 2 },
  ],
  'DEP-ANAES': [
    { title: 'Aisys CS2 Carestation Anesthesia Unit', category: 'Anaesthesia Workstation', manufacturer: 'GE HealthCare', vendor: 'GE HealthCare ANZ', agent: 'GE Field Service Engineering', image_path: 'aisys_cs2.png', notes: 'Advanced electronic vaporiser integration active.', count: 10 },
    { title: 'Bispectral Index (BIS) Vista Monitor', category: 'Patient Monitoring', manufacturer: 'Medtronic', vendor: 'Medtronic', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'bis_vista.png', notes: 'Depth of anaesthesia neurological processing module.', count: 10 },
    { title: 'Bair Hugger 775 Warming Unit', category: 'Therapeutic Climate', manufacturer: '3M Australia', vendor: '3M Medical Division', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'bair_hugger.png', notes: 'Convective temperature management tracking attached.', count: 12 },
    { title: 'Mindray N19 Patient Monitor', category: 'Patient Monitoring', manufacturer: 'Mindray', vendor: 'Mindray Australia', agent: 'Mindray Field Service', image_path: 'mindray_n19.png', notes: 'Compact anaesthesia monitoring system for OR use.', count: 15 },
    { title: 'Belmont Rapid Infuser RI-2', category: 'Therapeutic Delivery', manufacturer: 'Belmont Medical Technologies', vendor: 'Belmont ANZ', agent: 'Belmont Field Service', image_path: 'belmont_rapid_infuser.png', notes: 'High-volume rapid blood and fluid resuscitation system.', count: 2 },
    { title: 'Drager Oxylog 3000 Plus', category: 'Anaesthesia Workstation', manufacturer: 'Dräger', vendor: 'Draeger Australia', agent: 'Draeger Field Engineering', image_path: 'oxylog_3000_plus.png', notes: 'Advanced electronic vaporiser integration active.', count: 4 },
    { title: 'Venue Go Portable Ultrasound System', category: 'Diagnostic Imaging', manufacturer: 'GE HealthCare', vendor: 'GE HealthCare ANZ', agent: 'GE Field Service Engineering', image_path: 'venue_go.png', notes: 'Compact ultrasound system for anaesthesia applications.', count: 10 },
    { title: 'Mindray N1 Portable Patient Monitor', category: 'Patient Monitoring', manufacturer: 'Mindray', vendor: 'Mindray Australia', agent: 'Mindray Field Service', image_path: 'mindray_n1.png', notes: 'Compact anaesthesia monitoring system for OR use.', count: 15 },
    { title: '950ANZ Humidifier', category: 'Therapeutic Climate', manufacturer: 'Fisher & Paykel Healthcare', vendor: 'Fisher & Paykel ANZ', agent: 'Fisher & Paykel Field Service', image_path: '950anz.png', notes: 'Active humidification system for anaesthesia circuits.', count: 10 },
    { title: 'GlideScope Core 10 Video Laryngoscope', category: 'Diagnostic', manufacturer: 'Verathon', vendor: 'Verathon Australasia', agent: 'Verathon Field Service', image_path: 'glidescope_core.png', notes: 'Smart digital airway visualization system with integrated HD recording on mobile workstation cart.', count: 4 },
    { title: 'Agilia SP PCA Syringe Driver', category: 'Therapeutic Delivery', manufacturer: 'Fresenius Kabi', vendor: 'Fresenius Kabi Australia', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'agilia_sp_pca.png', notes: 'Pole-mounted patient-controlled analgesia syringe driver with protective lockable drug bolster and Vigilant safety software.', count: 8 },
  ],  
  'DEP-OR': [
    { title: 'HexaLux IQ LED Surgical Light System', category: 'Surgical Infrastructure', manufacturer: 'Steris', vendor: 'Steris Australia', agent: 'Steris Factory Technical Services', image_path: 'hexalux.png', notes: 'Ceiling articulation counter-weight spring check clear.', count: 10 },
    { title: 'FT10 Electrosurgical Unit', category: 'Surgical Unit', manufacturer: 'Medtronic', vendor: 'Medtronic', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'ft10.png', notes: 'Electrosurgical generator unit. Mono/Bipolar inputs.', count: 15 },
    { title: 'Maquet AlphaMaxx Surgical Table', category: 'Surgical Infrastructure', manufacturer: 'Getinge', vendor: 'Getinge Australia', agent: 'Getinge Corporate Service', image_path: 'alphamaxx.png', notes: 'Hydraulic actuation fluid lines inspected.', count: 10 },
    { title: 'Bair Hugger 775 Warming Unit', category: 'Therapeutic Climate', manufacturer: '3M Australia', vendor: '3M Medical Division', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'bair_hugger.png', notes: 'Convective temperature management tracking attached.', count: 12 },
    { title: 'RapidVac Smoke Evacuator System', category: 'Surgical Unit', manufacturer: 'Medtronic', vendor: 'Medtronic', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'rapidvac.png', notes: 'Surgical smoke evacuation system for OR use.', count: 13 },
    { title: 'PneumoSure Insufflator', category: 'Surgical Unit', manufacturer: 'Stryker', vendor: 'Stryker Australia', agent: 'Stryker Field Service', image_path: 'pneumosure.png', notes: 'Laparoscopic insufflation system for minimally invasive surgery.', count: 10 },
    { title: 'Olympus CLV-190 Xenon Light Source', category: 'Surgical Infrastructure', manufacturer: 'Olympus', vendor: 'Olympus Australia', agent: 'Olympus Direct Technical Care', image_path: 'clv190.png', notes: 'High-intensity light source for endoscopic procedures.', count: 10 },
    { title: 'Olympus EVIS EXERA III Video System Center', category: 'Surgical Infrastructure', manufacturer: 'Olympus', vendor: 'Olympus Australia', agent: 'Olympus Direct Technical Care', image_path: 'exera3.png', notes: 'High-definition video processing stack for endoscopic procedures.', count: 10 },
    { title: 'Stryker CORE 2 Camera System', category: 'Surgical Infrastructure', manufacturer: 'Stryker', vendor: 'Stryker Australia', agent: 'Stryker Field Service', image_path: 'stryker_core2.png', notes: 'High-definition camera system for endoscopic procedures.', count: 10 },
    { title: 'Medtronic O-arm', category: 'Diagnostic Imaging', manufacturer: 'Medtronic', vendor: 'Medtronic', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'o_arm.png', notes: 'Intraoperative 3D imaging system for surgical navigation.', count: 1 },
    { title: 'HoverMatt Air Transfer System', category: 'Patient Handling', manufacturer: 'HoverTech', vendor: 'HoverTech Australia', agent: 'HoverTech Field Service', image_path: 'hovermatt.png', notes: 'Air-assisted patient transfer system for OR use.', count: 15 },
    { title: 'Medtronic Midas Rex MR8', category: 'Surgical Unit', manufacturer: 'Medtronic', vendor: 'Medtronic', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'midas_rex_mr8.png', notes: 'High-speed pneumatic surgical drill system for cranial, spine, and orthopaedic procedures.', count: 4 },
    { title: 'Zeiss OPMI PENTERO 800 Visualisation System', category: 'Surgical Infrastructure', manufacturer: 'Carl Zeiss Microscopy', vendor: 'Zeiss Australasia', agent: 'Zeiss Technical Service', image_path: 'pentero800.png', notes: 'Premium surgical microscope stack with integrated digital fluorescence and HD recording options.', count: 2 },
    { title: 'Philips Veradius Neo Mobile C-Arm', category: 'Diagnostic Imaging', manufacturer: 'Philips Healthcare', vendor: 'Philips Australia', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'veradius_neo.png', notes: 'Mobile flat-detector fluoroscopic C-arm for daily orthopaedic and vascular navigation.', count: 3 }
  ],
  'DEP-CCU': [
    { title: 'IntelliVue MX700 Bedside Patient Monitor', category: 'Patient Monitoring', manufacturer: 'Philips Healthcare', vendor: 'Philips Healthcare', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'mx700.png', notes: 'Configured for high-acuity cardiac telemetry paths.', count: 8 },
    { title: 'Pagewriter TC50 ECG', category: 'Cardiology Diagnostic', manufacturer: 'GE HealthCare', vendor: 'GE HealthCare ANZ', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'pagewriter_tc50.png', notes: '12-lead acquisition printer cart layout.', count: 2 },
    { title: 'Zoll X-Series Defibrillator', category: 'Emergency Response', manufacturer: 'Zoll Medical', vendor: 'Zoll Medical Australia', agent: 'Zoll Medical Australia', image_path: 'zoll_x_series.png', notes: 'Mobile defibrillator with pacing capabilities.', count: 2 },
    { title: 'Intellivue X2 Mobile Patient Monitor', category: 'Patient Monitoring', manufacturer: 'Philips Healthcare', vendor: 'Philips Healthcare', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'x2.png', notes: 'Mobile monitoring unit for flexible bedside use.', count: 10 }, 
    { title: 'Mindray SV70 Ventilator', category: 'Life Support', manufacturer: 'Mindray', vendor: 'Mindray Australia', agent: 'Mindray Field Service', image_path: 'mindray_sv70.png', notes: 'Compact ventilator for cardiac care applications.', count: 2 },
    { title: 'BodyGuard 323 Color Vision Infusion Pump', category: 'Therapeutic Delivery', manufacturer: 'ICU Medical', vendor: 'Device Technologies', agent: 'Device Tech Field Service', image_path: 'bodyguard_323.png', notes: 'Infusion pump with color-coded safety features.', count: 4 },
    { title: 'Intellivue MX40 Telemetry Monitor', category: 'Patient Monitoring', manufacturer: 'Philips Healthcare', vendor: 'Philips Healthcare', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'mx40.png', notes: 'Wearable telemetry monitor for ambulatory cardiac patients.', count: 8 },
    { title: 'Intellivue MX450 Transport Monitor', category: 'Patient Monitoring', manufacturer: 'Philips Healthcare', vendor: 'Philips Healthcare', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'mx450.png', notes: 'Transport monitor for intra-hospital transfers.', count: 2 },
  ],
  'DEP-RAD': [
    { title: 'Welch Allyn Continuous Vital Signs Monitor', category: 'Patient Monitoring', manufacturer: 'Hillrom / Welch Allyn', vendor: 'Welch Allyn Australia', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'wa_csm.png', notes: 'Mobile vital signs monitor for radiology suite use.', count: 10 },
    { title: 'Symbia Intevo SPECT/CT Scanner', category: 'Diagnostic Imaging', manufacturer: 'Siemens Healthineers', vendor: 'Siemens ANZ', agent: 'Siemens Field Engineering', image_path: 'symbia.png', notes: 'Nuclear molecular track diagnostics alignment validation required.', count: 1 },
    { title: 'Mobilett Elara Max Digital Mobile X-Ray', category: 'Diagnostic Imaging', manufacturer: 'Siemens Healthineers', vendor: 'Siemens ANZ', agent: 'Siemens Field Engineering', image_path: 'mobilett.png', notes: 'Mobile imaging array framework for ward rounds.', count: 2 },
    { title: 'Voluson E10 Ultrasound System', category: 'Diagnostic Imaging', manufacturer: 'GE HealthCare', vendor: 'GE HealthCare ANZ', agent: 'GE Field Service Engineering', image_path: 'voluson.png', notes: 'Equipped with Matrix internal sector imaging arrays.', count: 2 },
    { title: 'Zoll AED3 BLS Defibrillator', category: 'Emergency Response', manufacturer: 'Zoll Medical', vendor: 'Zoll Medical Australia', agent: 'Zoll Medical Australia', image_path: 'zoll_aed3.png', notes: 'Automated external defibrillator for basic life support.', count: 1 },
  ],
  'DEP-MED-ACUTE': [
    { title: 'Welch Allyn Connex Spot Monitor', category: 'Patient Monitoring', manufacturer: 'Hillrom / Welch Allyn', vendor: 'Welch Allyn Australia', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'wa_csm.png', notes: 'Wall mount setup. Telemetry configuration logged.', count: 10 },
    { title: 'Welch Allyn Connex Spot Monitor', category: 'Patient Monitoring', manufacturer: 'Hillrom / Welch Allyn', vendor: 'Welch Allyn Australia', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'wa_csm_stand.png', notes: 'Mobile cart configuration rollout array.', count: 10 },
    { title: 'Alaris 8100 Infusion Pump', category: 'Therapeutic Delivery', manufacturer: 'Becton Dickinson', vendor: 'BD Australia', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'alaris8100.png', notes: 'Standard medical fluid pump configuration.', count: 12 },
    { title: 'Verathon i10 Bladder Scanner', category: 'Diagnostic', manufacturer: 'Verathon', vendor: 'Verathon Australasia', agent: 'Verathon Field Service', image_path: 'verathon_i100.png', notes: 'Portable bladder ultrasound scanner for non-invasive volume assessment.', count: 1 },
    { title: 'Zoll AED3 BLS Defibrillator', category: 'Emergency Response', manufacturer: 'Zoll Medical', vendor: 'Zoll Medical Australia', agent: 'Zoll Medical Australia', image_path: 'zoll_aed3.png', notes: 'Automated external defibrillator for basic life support.', count: 1 },
    { title: 'Welch Allyn GS777 Diagnostic Set', category: 'Diagnostic', manufacturer: 'Hillrom / Welch Allyn', vendor: 'Welch Allyn Australia', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'gs777.png', notes: 'Mobile diagnostic set with otoscope and ophthalmoscope.', count: 3 },
    { title: 'B Braun Infusomat Space Syringe Pump', category: 'Therapeutic Delivery', manufacturer: 'B Braun', vendor: 'B Braun Australia', agent: 'B Braun Field Service', image_path: 'infusomat_space.png', notes: 'Syringe pump for precise medication delivery.', count: 10 },
    { title: 'Airvo 2 Humidified High Flow System', category: 'Therapeutic Delivery', manufacturer: 'Fisher & Paykel Healthcare', vendor: 'Fisher & Paykel ANZ', agent: 'Fisher & Paykel Field Service', image_path: 'airvo2.png', notes: 'High flow nasal cannula respiratory support system.', count: 4 },
    { title: 'Cocoon CWS5000 Patient Warmer', category: 'Thermal Management', manufacturer: 'Care Essentials', vendor: 'Care Essentials Australia', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'cocoon_cws5000.png', notes: 'Convective forced-air patient warming unit with 0.2-micron HEPA filtration. Dual-speed brushless blower configuration.', count: 4 },
    { title: 'Mindray R700 Electrocardiograph', category: 'Cardiology Diagnostic', manufacturer: 'Mindray', vendor: 'Mindray Australia', agent: 'Mindray Field Service', image_path: 'mindray_r700.png', notes: '12-lead ECG machine with advanced arrhythmia analysis algorithms.', count: 2 },
    { title: 'Oxylitre Suction Unit', category: 'Therapeutic Delivery', manufacturer: 'Oxylitre', vendor: 'Oxylitre Australia', agent: 'Oxylitre Field Service', image_path: 'oxylitre.png', notes: 'Portable suction unit with adjustable vacuum settings for airway clearance.', count: 4 },
  ],
  'DEP-AGSU': [
    { title: 'Intellivue MX550 Patient Monitor', category: 'Patient Monitoring', manufacturer: 'Philips HealthCare', vendor: 'Philips Healthcare', agent: 'Philips HealthCare', image_path: 'mx550.png', notes: 'Standard surgical tracking configuration.', count: 8 },
    { title: 'Alaris 8100 Infusion Pump', category: 'Therapeutic Delivery', manufacturer: 'Becton Dickinson', vendor: 'BD Australia', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'alaris8100.png', notes: 'Surgical recovery volumetric system.', count: 15 },
    { title: 'CADD-Solis Ambulatory PCA Pump', category: 'Therapeutic Delivery', manufacturer: 'ICU Medical', vendor: 'Device Technologies', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'cadd_solis.png', notes: 'Patient-controlled analgesia targeted lockbox assembly.', count: 6 },
    { title: 'Zoll AED3 BLS Defibrillator', category: 'Emergency Response', manufacturer: 'Zoll Medical', vendor: 'Zoll Medical Australia', agent: 'Zoll Medical Australia', image_path: 'zoll_aed3.png', notes: 'Automated external defibrillator for basic life support.', count: 1 },
    { title: 'Pagewriter TC50 Electrocardiograph', category: 'Cardiology Diagnostic', manufacturer: 'Philips HealthCare', vendor: 'Philips Healthcare', agent: 'Philips HealthCare', image_path: 'pagewriter_tc50.png', notes: '12-lead acquisition printer cart layout.', count: 1 },
  ],
  'DEP-REHAB': [
    { title: 'Intellivue MX550 Patient Monitor', category: 'Patient Monitoring', manufacturer: 'Philips HealthCare', vendor: 'Philips Healthcare', agent: 'Philips HealthCare', image_path: 'mx550.png', notes: 'Sub-acute observation fleet cart.', count: 6 },
    { title: 'Chattanooga Intelect Neo Electrotherapy', category: 'Physiotherapy Equipment', manufacturer: 'DJO Global', vendor: 'Biolab Australia', agent: 'Internal Biomed Specialist', image_path: 'intelect_neo.png', notes: 'Ultrasound/Laser therapeutic combination station.', count: 2 },
    { title: 'Snoezelen Sensory Bubble Column console', category: 'Neurological Therapy', manufacturer: 'Rompa', vendor: 'Specialist Therapeutic Solutions', agent: 'Internal Biomed Specialist', image_path: 'snoezelen.png', notes: 'Stroke rehabilitation cognitive stimulation hardware.', count: 1 },
    { title: 'CoughAssist E70 Exsufflator', category: 'Respiratory Therapy', manufacturer: 'Philips Respironics', vendor: 'Philips Healthcare', agent: 'Philips HealthCare', image_path: 'coughassist_e70.png', notes: 'Airway clearance device for patients with impaired cough.', count: 4 },
    { title: 'Metron Premium 3-Section Treatment Table', category: 'Allied Infrastructure', manufacturer: 'Metron Medical', vendor: 'Biolab Australia', agent: 'Internal Biomed Specialist', image_path: 'metron_table.png', notes: 'Electric hi-lo physiotherapy plinth. Actuator motor and foot switch safety checked.', count: 4 },
    { title: 'Kinetec Prima XL Knee CPM Machine', category: 'Physiotherapy Equipment', manufacturer: 'Kinetec', vendor: 'Device Technologies', image_path: 'kinetec_cpm.png', notes: 'Continuous passive motion motorized device for post-op knee and hip joint rehabilitation.', count: 3 },

  ],
  'DEP-CATH': [
    { title: 'Artis Zee Interventional Angio Console', category: 'Diagnostic Imaging', manufacturer: 'Siemens Healthineers', vendor: 'Siemens ANZ', agent: 'Siemens Field Engineering', image_path: 'artis_zee.png', notes: 'Fluoroscopy high-output radiation ceiling gantry.', count: 2 },
    { title: 'Mac-Lab IT Hemodynamic Recording System', category: 'Cardiology Diagnostic', manufacturer: 'GE HealthCare', vendor: 'GE HealthCare ANZ', agent: 'GE Field Service Engineering', image_path: 'maclab.png', notes: 'Direct arterial pressure tracing transduction hub.', count: 2 },
    { title: 'Avanti Fluid Infusion Station', category: 'Therapeutic Delivery', manufacturer: 'Medrad', vendor: 'Device Technologies', agent: 'Device Tech Field Service', image_path: 'avanti.png', notes: 'Contrast injection high-pressure automated syringe.', count: 2 },
    { title: 'Arrow AC3 Optimus Intra-Aortic Balloon Pump', category: 'Life Support', manufacturer: 'Teleflex / Arrow', vendor: 'Teleflex Medical Australia', image_path: 'arrow_iabp.png', notes: 'Intra-aortic balloon pump for mechanical circulatory support. Helium tank level verified.', count: 2 },
    { title: 'Volcano CORE Precision Guided Therapy System', category: 'Diagnostic Imaging', manufacturer: 'Philips Healthcare', vendor: 'Philips Healthcare', image_path: 'volcano_ivus.png', notes: 'Mobile intravascular ultrasound (IVUS) cart for precision coronary lesion assessment.', count: 2 },
    { title: 'Zoll R Series ALS Defibrillator', category: 'Emergency Response', manufacturer: 'Zoll Medical', vendor: 'Zoll Medical Australia', agent: 'Zoll Medical Australia', image_path: 'zoll_r_series.png', notes: 'Mobile defibrillator with pacing capabilities.', count: 4 },
    { title: 'CARTO 3 Electrophysiology Mapping System', category: 'Cardiology Diagnostic', manufacturer: 'Biosense Webster', vendor: 'Johnson & Johnson Medical', image_path: 'carto3.png', notes: 'Advanced 3D cardiac electromagnetic mapping console for complex arrhythmias.', count: 1 },
    { title: 'Emprint Microwave Ablation System', category: 'Therapeutic Delivery', manufacturer: 'Medtronic', vendor: 'Medline Industries Australia', image_path: 'emprint_mwa.png', notes: 'Microwave ablation generator console equipped with active thermosphere antenna controls.', count: 2 },
    { title: 'Arctic Front CryoAblation Console', category: 'Therapeutic Delivery', manufacturer: 'Medtronic', vendor: 'Medline Industries Australia', image_path: 'cryo_ablator.png', notes: 'Cardiac cryoablation system utilizing liquid nitrous oxide for pulmonary vein isolation.', count: 1 },
    { title: 'Valleylab FT10 Energy Platform', category: 'Surgical Unit', manufacturer: 'Medtronic / Covidien', vendor: 'Medline Industries Australia', image_path: 'valleylab_ft10.png', notes: 'High-frequency electrosurgical ESU unit with advanced LigaSure tissue fusion algorithm.', count: 1 },
    { title: 'Rotablator Rotational Atherectomy System', category: 'Therapeutic Delivery', manufacturer: 'Boston Scientific', vendor: 'Boston Scientific Australia', image_path: 'rotablator.png', notes: 'Rotational atherectomy console with pneumatic advancer and foot pedal loop. Speed calibration verified.', count: 1 },
    { title: 'AngioJet Ultra Thrombectomy System', category: 'Therapeutic Delivery', manufacturer: 'Boston Scientific', vendor: 'Boston Scientific Australia', image_path: 'angiojet.png', notes: 'Mechanical rheolytic thrombectomy console for rapid aspiration of coronary thrombus blocks.', count: 1 },
    { title: 'Medtronic ACT Plus Automated Coagulation Timer', category: 'Cardiology Diagnostic', manufacturer: 'Medtronic', vendor: 'Medline Industries Australia', image_path: 'act_plus.png', notes: 'Dedicated dual-well coagulation monitoring system for heparin management.', count: 2 },
    { title: 'Philips EPIQ CVx Cardiovascular Ultrasound', category: 'Diagnostic Imaging', manufacturer: 'Philips Healthcare', vendor: 'Philips Healthcare', image_path: 'epiq_cvx.png', notes: 'Premium echocardiography system for TEE and TTE structural heart guidance.', count: 1 },
    { title: 'Penumbra Indigo Aspiration System', category: 'Therapeutic Delivery', manufacturer: 'Penumbra Inc', vendor: 'Device Technologies', agent: 'Device Tech Field Service', image_path: 'indigo_aspiration.png', notes: 'Continuous mechanical thrombectomy engine for peripheral and coronary clot extractions.', count: 1 }
  ],
  'DEP-RENAL': [
    { title: 'AK 98 Hemodialysis System', category: 'Therapeutic Delivery', manufacturer: 'Baxter', vendor: 'Baxter Healthcare ANZ', agent: 'Baxter Corporate Engineering', image_path: 'ak98.png', notes: 'RO water purification interface certified dynamic tracking.', count: 16 },
    { title: 'Crit-Line IV Hematocrit Monitor', category: 'Patient Monitoring', manufacturer: 'Fresenius Medical', vendor: 'Device Technologies', agent: 'Device Tech Field Service', image_path: 'critline.png', notes: 'Non-invasive blood volume state tracking sensor module.', count: 8 },
    { title: 'Intellivue MX550 Patient Monitor', category: 'Patient Monitoring', manufacturer: 'GE HealthCare', vendor: 'Stat Medical Supplies', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'mx550.png', notes: 'Dialysis session serial evaluation tracking assembly.', count: 4 },
    { title: 'enFlow Fluid Warming System', category: 'Therapeutic Climate', manufacturer: 'Vyaire Medical', vendor: 'Vyaire Medical Australia', agent: 'Vyaire Field Service', image_path: 'enflow.png', notes: 'Fluid warming system for intravenous infusions during dialysis.', count: 4 },
  ],
  'DEP-MAT': [
    { title: 'Philips Avalon FM30 Cardiotocograph', category: 'Patient Monitoring', manufacturer: 'Philips Healthcare', vendor: 'Philips Healthcare', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'avalon_fm30.png', notes: 'Maternal and fetal cardiotocograph engine with Smart Pulse cross-channel verification loops.', count: 20 },
    { title: 'Affinity 4 Birthing Labor Bed structural', category: 'Infrastructure', manufacturer: 'Hillrom', vendor: 'Hillrom Australia', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'affinity4.png', notes: 'Electric positioning mechanism logic arrays tested.', count: 20 },
    { title: 'Entonox Delivery Gas Scavenger Set', category: 'Therapeutic Gas', manufacturer: 'BOC Medical', vendor: 'BOC Australia', agent: 'Internal Biomed Specialist', image_path: 'entonox.png', notes: 'Nitrous oxide demand valve safety check clean.', count: 20 },
    { title: 'CADD Solis Ambulatory PCA Pump', category: 'Therapeutic Delivery', manufacturer: 'ICU Medical', vendor: 'Device Technologies', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'cadd_solis.png', notes: 'Patient-controlled analgesia targeted lockbox assembly.', count: 20 },
    { title: 'Panda Warmer Infant Radiant Warmer', category: 'Therapeutic Climate', manufacturer: 'GE HealthCare', vendor: 'GE HealthCare ANZ', agent: 'GE Field Service Engineering', image_path: 'panda_warmer.png', notes: 'Infant radiant warmer with servo-controlled temperature regulation.', count: 20 },
    { title: 'Rad-5 Pulse CO-Oximeter', category: 'Patient Monitoring', manufacturer: 'Masimo', vendor: 'Masimo Australia', agent: 'Masimo Field Service', image_path: 'rad5.png', notes: 'Non-invasive pulse CO-oximetry monitor for maternal and fetal oxygenation assessment.', count: 20 },
    { title: '950ANZ Humidifier', category: 'Therapeutic Climate', manufacturer: 'Fisher & Paykel Healthcare', vendor: 'Fisher & Paykel ANZ', agent: 'Fisher & Paykel Field Service', image_path: '950anz.png', notes: 'Active humidification system for maternal respiratory support.', count: 20 },
    { title: 'Medela Symphony Breast Pump', category: 'Therapeutic Delivery', manufacturer: 'Medela', vendor: 'Medela Australia', agent: 'Medela Field Service', image_path: 'medela_symphony.png', notes: 'Electric breast pump for maternal lactation support.', count: 2 },
    { title: 'Perneo T-Piece Infant Resuscitator', category: 'Life Support', manufacturer: 'Fisher & Paykel Healthcare', vendor: 'Fisher & Paykel ANZ', agent: 'Fisher & Paykel Field Service', image_path: 'perneo.png', notes: 'Neonatal T-piece gas resuscitator with integrated maximum pressure relief circuit valves.', count: 20 },
    { title: 'Sonicaid SR2 Digital Doppler', category: 'Diagnostic', manufacturer: 'Huntleigh Healthcare', vendor: 'LMT Surgical', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'sonicaid_sr2.png', notes: 'Waterproof handheld rate-display fetal acoustic Doppler probe configuration.', count: 20 },
  ],
  'DEP-ONC': [
    { title: 'Intellivue MX550 Patient Monitor', category: 'Patient Monitoring', manufacturer: 'GE HealthCare', vendor: 'Stat Medical Supplies', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'mx550.png', notes: 'Chemotherapy cycle vital parameters monitor.', count: 6 },
    { title: 'Agilia VP MC WiFi', category: 'Infusion Pump', manufacturer: 'Fresenius Kabi', vendor: 'Fresenius Kabi Australia', agent: 'Fresenius Kabi Australia', image_path: 'agilia_vp_mc_wifi.png', notes: 'Cytotoxic spill risk protection closed chamber system.', count: 20 },
    { title: 'Zoll AED3 BLS Defibrillator', category: 'Emergency Response', manufacturer: 'Zoll Medical', vendor: 'Zoll Medical Australia', agent: 'Zoll Medical Australia', image_path: 'zoll_aed3.png', notes: 'Automated external defibrillator for basic life support.', count: 1 },
    { title: 'CADD-Solis VIP Ambulatory PCA Pump', category: 'Therapeutic Delivery', manufacturer: 'ICU Medical', vendor: 'Device Technologies', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'cadd_solis_vip.png', notes: 'Patient-controlled analgesia targeted lockbox assembly.', count: 4 },
  ],
  'DEP-PED': [
    { title: 'B Braun Infusomat Space Syringe Pump', category: 'Therapeutic Delivery', manufacturer: 'B Braun', vendor: 'B Braun Australia', agent: 'B Braun Field Service', image_path: 'infusomat_space.png', notes: 'Syringe pump with paediatric dosing safety checks.', count: 12 },
    { title: 'Intellivue MX550 Patient Monitor', category: 'Patient Monitoring', manufacturer: 'Philips Healthcare', vendor: 'Philips Healthcare', agent: 'Philips Healthcare', image_path: 'mx550.png', notes: 'Equipped with child/infant monitoring array sets.', count: 4 },
    { title: 'Intellivue X3 Mobile Patient Monitor', category: 'Patient Monitoring', manufacturer: 'Philips Healthcare', vendor: 'Philips Healthcare', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'x3.png', notes: 'Mobile monitoring unit for flexible bedside use.', count: 4 },
    { title: 'Masimo RDS-3 Docking Station', category: 'Patient Monitoring', manufacturer: 'Masimo', vendor: 'Masimo Australia', agent: 'Masimo Field Service', image_path: 'rds3.png', notes: 'Remote docking station for Masimo patient monitors.', count: 30 },
    { title: 'Masimo Radical-7 Pulse CO-Oximeter', category: 'Patient Monitoring', manufacturer: 'Masimo', vendor: 'Masimo Australia', agent: 'Masimo Field Service', image_path: 'radical7.png', notes: 'Advanced pulse CO-oximetry monitor with rainbow technology for paediatric patients.', count: 30 },
    { title: 'Zoll AED3 BLS Defibrillator', category: 'Emergency Response', manufacturer: 'Zoll Medical', vendor: 'Zoll Medical Australia', agent: 'Zoll Medical Australia', image_path: 'zoll_aed3.png', notes: 'Automated external defibrillator for basic life support.', count: 1 },
    { title: 'Welch Allyn CSM Spot Monitor', category: 'Patient Monitoring', manufacturer: 'Hillrom / Welch Allyn', vendor: 'Welch Allyn Australia', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'wa_csm.png', notes: 'Mobile vital signs monitor for paediatric ward use.', count: 8 },
    { title: 'Welch Allyn GS777 Diagnostic Set', category: 'Diagnostic', manufacturer: 'Hillrom / Welch Allyn', vendor: 'Welch Allyn Australia', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'gs777.png', notes: 'Mobile diagnostic set with otoscope and ophthalmoscope.', count: 2 },
    { title: 'Fisher & Paykel Airvo 3 Humidified High Flow System', category: 'Therapeutic Delivery', manufacturer: 'Fisher & Paykel Healthcare', vendor: 'Fisher & Paykel ANZ', agent: 'Fisher & Paykel Field Service', image_path: 'airvo3.png', notes: 'High flow nasal cannula respiratory support system for paediatric patients.', count: 4 },
    { title: 'B Braun Perfusor Space Syringe Pump', category: 'Therapeutic Delivery', manufacturer: 'B Braun', vendor: 'B Braun Australia', agent: 'B Braun Field Service', image_path: 'perfusor_space.png', notes: 'Syringe pump with paediatric dosing safety checks.', count: 20 },
  ],
  'DEP-NICU': [
    { title: 'Giraffe OmniBed Incubator Heater', category: 'Therapeutic Climate', manufacturer: 'GE HealthCare', vendor: 'GE HealthCare ANZ', agent: 'GE Field Service Engineering', image_path: 'omnibed.png', notes: 'Neonatal closed-loop environment thermal array controls.', count: 20 },
    { title: 'Babylog VN500 Neonatal Ventilator', category: 'Life Support', manufacturer: 'Dräger', vendor: 'Draeger Australia', agent: 'Draeger Field Engineering', image_path: 'vn500.png', notes: 'High-frequency oscillation system micro-step loops.', count: 10 },
    { title: 'IntelliVue MX800 Bedside Patient Monitor', category: 'Patient Monitoring', manufacturer: 'Philips Healthcare', vendor: 'Philips Healthcare', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'mx800.png', notes: 'Neonatal target tracking configurations locked.', count: 55 },
    { title: 'Intellivue X3 Mobile Patient Monitor', category: 'Patient Monitoring', manufacturer: 'Philips Healthcare', vendor: 'Philips Healthcare', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'x3.png', notes: 'Mobile monitoring unit for flexible bedside use.', count: 55 },
    { title: 'Medela Symphony Breast Pump', category: 'Therapeutic Delivery', manufacturer: 'Medela', vendor: 'Medela Australia', agent: 'Medela Field Service', image_path: 'medela_symphony.png', notes: 'Electric breast pump for maternal lactation support.', count: 20 },
    { title: 'Medela Calesca Milk Warmer', category: 'Therapeutic Climate', manufacturer: 'Medela', vendor: 'Medela Australia', agent: 'Medela Field Service', image_path: 'calesca.png', notes: 'Milk warming system for neonatal feeding preparation.', count: 40 },
    { title: 'B Braun Perfusor Space Syringe Pump', category: 'Therapeutic Delivery', manufacturer: 'B Braun', vendor: 'B Braun Australia', agent: 'B Braun Field Service', image_path: 'perfusor_space.png', notes: 'Syringe pump with neonatal dosing safety checks.', count: 40 },
    { title: 'Panda Warmer Infant Radiant Warmer', category: 'Therapeutic Climate', manufacturer: 'GE HealthCare', vendor: 'GE HealthCare ANZ', agent: 'GE Field Service Engineering', image_path: 'panda_warmer.png', notes: 'Infant radiant warmer with servo-controlled temperature regulation.', count: 20 },
    { title: 'Neopuff Infant T-Piece Resuscitator', category: 'Life Support', manufacturer: 'Fisher & Paykel Healthcare', vendor: 'Fisher & Paykel Healthcare', agent: 'Fisher & Paykel Healthcare', image_path: 'neopuff.png', notes: 'Pneumatic infant resuscitator for precise peak inspiratory pressure control.', count: 55 },
    { title: "Isolette 8000 Plus Infant Incubator", category: "Therapeutic Climate", manufacturer: "Dräger", vendor: "Draeger Australia", service_agent: "Draeger Australia", image_path: "img/equipment/isolette8000.png", notes: "Advanced neonatal incubator with integrated data monitoring and precise climate humidity control.", count: 15 },
  ],
  'DEP-PICU': [
    { title: 'Hamilton-G5 Critical Care Ventilator', category: 'Life Support', manufacturer: 'Hamilton Medical', vendor: 'Device Technologies', agent: 'Device Tech Field Service', image_path: 'hamilton_g5.png', notes: 'Paediatric high-compliance respiratory flow patterns.', count: 6 },
    { title: 'IntelliVue MX700 Bedside Patient Monitor', category: 'Patient Monitoring', manufacturer: 'Philips Healthcare', vendor: 'Philips Healthcare', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'mx700.png', notes: 'Tethered central nurse dashboard link protocols.', count: 6 },
    { title: 'Alaris 8100 Infusion Pump', category: 'Therapeutic Delivery', manufacturer: 'Becton Dickinson', vendor: 'BD Australia', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'alaris8100.png', notes: 'Strict critical dosing validation checks profile.', count: 18 }
  ],
  'DEP-ENDO': [
    { title: 'EVIS EXERA III Video System Center', category: 'Diagnostic Endoscopy', manufacturer: 'Olympus', vendor: 'Olympus Australia', agent: 'Olympus Direct Technical Care', image_path: 'exera3.png', notes: 'High-definition video processing stack system.', count: 4 },
    { title: 'Olympus CLV-190 Xenon Light Source', category: 'Surgical Infrastructure', manufacturer: 'Olympus', vendor: 'Olympus Australia', agent: 'Olympus Direct Technical Care', image_path: 'clv190.png', notes: 'Visual guidance high-intensity illuminator.', count: 4 },
    { title: 'OER-Elite Endoscope Reprocessor washer', category: 'Decontamination', manufacturer: 'Olympus', vendor: 'Olympus Australia', agent: 'Olympus Direct Technical Care', image_path: 'oer_elite.png', notes: 'Sterilization integrity automated log module validation.', count: 2 },
    { title: "ERBE VIO 3 Electrosurgical Workstation", category: "Surgical Unit", manufacturer: "ERBE Elektromedizin", vendor: "ERBE Medical Australia", service_agent: "ERBE Medical Australia", image_path: "img/equipment/erbe_vio3.png", notes: "High-frequency electrosurgical unit optimized for GI tissue interventions and specialized mucosal cutting profiles.", count: 4 },
    { title: "BeneVision N19 Bedside Patient Monitor", category: "Patient Monitoring", manufacturer: "Mindray", vendor: "Mindray Australia", service_agent: "Mindray Australia", image_path: "img/equipment/mindray_n19.png", notes: "High-definition endoscopic procedure monitoring console interface.", count: 4 },
    { title: "BeneVision N1 Transport Patient Monitor", category: "Patient Monitoring", manufacturer: "Mindray", vendor: "Mindray Australia", service_agent: "Mindray Australia", image_path: "img/equipment/mindray_n1.png", notes: "Ultra-compact transport vital signs monitor configuration. Interchanges directly into the bedside N19 docking slot.", count: 4 },
  ],
  'DEP-CHS': [
    { title: 'Intellivue MX550 Patient Monitor', category: 'Patient Monitoring', manufacturer: 'Philips Healthcare', vendor: 'Philips Healthcare', agent: 'Philips Healthcare', image_path: 'mx550.png', notes: 'Ambulatory clinic tracking configuration.', count: 8 },
    { title: 'Welch Allyn PanOptic Ophthalmoscope desk set', category: 'Diagnostic', manufacturer: 'Hillrom / Welch Allyn', vendor: 'Welch Allyn Australia', agent: 'Philips Healthcare', image_path: 'panoptic.png', notes: 'Wall-transformer integrated charging layout module.', count: 6 },
    { title: "Welch Allyn Connex Spot Monitor (Roll Stand)", category: "Patient Monitoring", manufacturer: "Hillrom / Welch Allyn", vendor: "Welch Allyn Australia", service_agent: "Philips Healthcare", image_path: "img/equipment/wa_csm_stand.png", notes: "Mobile triage vital signs rolling cart for clinic consulting rooms.", count: 10 },
    { title: "Mindray R300 Electrocardiograph", category: "Cardiology Diagnostic", manufacturer: "Mindray", vendor: "Mindray Australia", service_agent: "Mindray Australia", image_path: "img/equipment/mindray_r300.png", notes: "12-lead acquisition printer cart layout for outpatient screening.", count: 2 },
  ],
  'DEP-PHYSIO': [
    { title: 'Chattanooga Intelect Neo Electrotherapy', category: 'Physiotherapy Equipment', manufacturer: 'DJO Global', vendor: 'Biolab Australia', agent: 'Internal Biomed Specialist', image_path: 'intelect_neo.png', notes: 'Muscle stimulation calibration matrix verified.', count: 4 },
    { title: 'Curapuls 670 Pulsed Shortwave Diathermy Unit', category: 'Physiotherapy Equipment', manufacturer: 'Enraf-Nonius', vendor: 'Biolab Australia', agent: 'Internal Biomed Specialist', image_path: 'curapuls_670.png', notes: 'High-frequency electromagnetic deep tissue therapy unit. RF leakage checked.', count: 2 },
    { title: 'Gait Trainer 3 Clinical Rehabilitation Treadmill', category: 'Allied Infrastructure', manufacturer: 'Biodex Medical Systems', vendor: 'Device Technologies', agent: 'Device Tech Field Service', image_path: 'biodex_treadmill.png', notes: 'Motorized gait training treadmill with integrated patient step analytics.', count: 2 },
    { title: 'Metron Premium 3-Section Examination Table', category: 'Allied Infrastructure', manufacturer: 'Metron Medical', vendor: 'Biolab Australia', agent: 'Internal Biomed Specialist', image_path: 'metron_table.png', notes: 'Actuator lift safety test validation passed.', count: 4 },
    { title: 'Liko Sabina II Mobile Patient Lift', category: 'Allied Infrastructure', manufacturer: 'Hillrom', vendor: 'Hillrom Australia', agent: 'Internal Biomed Specialist', image_path: 'liko_sabina.png', notes: 'Electric sit-to-stand mobile hoist. Battery and actuator load limit tested.', count: 2 }
  ],
  'DEP-POOL': [
    { title: 'Kendall SCD 700 Sequential Compression Comfort System', category: 'Therapeutic Delivery', manufacturer: 'Cardinal Health', vendor: 'Medline Industries Australia', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'scd700.png', notes: 'Mechanical sequential compression engine for deep vein thrombosis prophylaxis.', count: 75 },
    { title: 'Kangaroo ePump Enteral Feeding System', category: 'Therapeutic Delivery', manufacturer: 'Cardinal Health', vendor: 'Medline Industries Australia', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'kangaroo_epump.png', notes: 'Continuous volumetric enteral nutrition and hydration infusion pump assembly.', count: 75 },
  ],
  'DEP-BIOMED': [
    { title: 'Fluke Biomedical ESA615 Safety Analyzer', category: 'Test Equipment', manufacturer: 'Fluke Biomedical', vendor: 'Biolab Australia', agent: 'Fluke Calibration Laboratory', image_path: 'esa615.png', notes: 'Precision automated electrical compliance tool.', count: 4 },
    { title: 'Rigel Uni-Therm Electrosurgical Analyzer', category: 'Test Equipment', manufacturer: 'Seaward Group', vendor: 'Emona Instruments', agent: 'Emona Corporate Calibration', image_path: 'unitherm.png', notes: 'RF leakage and power curve verification array.', count: 1 }
  ],
  'DEP-BEER': [
    { title: 'Alaris 8100 Infusion Pump', category: 'Therapeutic Delivery', manufacturer: 'Becton Dickinson', vendor: 'BD Australia', agent: 'NSW Health Biomed Engineering (JHH Group)', image_path: 'alaris8100.png', notes: 'Loan pool stock inventory configuration clean.', count: 10 },
    { title: 'Intellivue MX550 Patient Monitor', category: 'Patient Monitoring', manufacturer: 'Philips Healthcare', vendor: 'Philips Healthcare', agent: 'Philips Healthcare', image_path: 'mx550.png', notes: 'Loan pool standby rollout tracking assembly.', count: 10 }
  ]
};

// Target list representing all JHH Precinct location configurations exactly matching your schema mappings
const jhhLocations = [
  { id: 'LOC-JHH-ICU',       dept: 'DEP-ICU',       ward: 'Main ICU' },
  { id: 'LOC-JHH-ED',        dept: 'DEP-ED',        ward: 'Adult ED' },
  { id: 'LOC-JHH-ANAES',     dept: 'DEP-ANAES',     ward: 'Anaesthetics Fleet' },
  { id: 'LOC-JHH-PARU',      dept: 'DEP-ANAES',     ward: 'PACU Recovery' },
  { id: 'LOC-JHH-OR',        dept: 'DEP-OR',        ward: 'Main Theatres' },
  { id: 'LOC-JHH-CCU',       dept: 'DEP-CCU',       ward: 'Coronary Care' },
  { id: 'LOC-JHH-RAD',       dept: 'DEP-RAD',       ward: 'Radiology Block' },
  { id: 'LOC-JHH-NUCMED',    dept: 'DEP-RAD',       ward: 'Nuclear Med' },
  { id: 'LOC-JHH-W_E1',      dept: 'DEP-MED-ACUTE', ward: 'Ward E1' },
  { id: 'LOC-JHH-W_E2',      dept: 'DEP-MED-ACUTE', ward: 'Ward E2' },
  { id: 'LOC-JHH-W_E3',      dept: 'DEP-MED-ACUTE', ward: 'Ward E3' },
  { id: 'LOC-JHH-W_F1',      dept: 'DEP-MED-ACUTE', ward: 'Ward F1' },
  { id: 'LOC-JHH-W_F2',      dept: 'DEP-MED-ACUTE', ward: 'Ward F2' },
  { id: 'LOC-JHH-W_F3',      dept: 'DEP-CCU',       ward: 'Ward F3' },
  { id: 'LOC-JHH-W_G1',      dept: 'DEP-AGSU',      ward: 'Ward G1' },
  { id: 'LOC-JHH-W_G2',      dept: 'DEP-REHAB',     ward: 'Ward G2' },
  { id: 'LOC-JHH-W_G3',      dept: 'DEP-CATH',      ward: 'Ward G3' },
  { id: 'LOC-JHH-W_H3',      dept: 'DEP-MED-ACUTE', ward: 'Ward H3' },
  { id: 'LOC-JHH-W_J3',      dept: 'DEP-AGSU',      ward: 'Ward J3' },
  { id: 'LOC-JHH-W_K1',      dept: 'DEP-RENAL',     ward: 'Ward K1' },
  { id: 'LOC-JHH-W_K2',      dept: 'DEP-MAT',       ward: 'Ward K2' },
  { id: 'LOC-JHH-W_K3',      dept: 'DEP-ONC',       ward: 'Ward K3' },
  { id: 'LOC-JHCH-W_H1',     dept: 'DEP-PED',       ward: 'Ward H1' },
  { id: 'LOC-JHCH-W_J1',     dept: 'DEP-PED',       ward: 'Ward J1' },
  { id: 'LOC-JHCH-W_J2',     dept: 'DEP-PED',       ward: 'Ward J2' },
  { id: 'LOC-JHCH-NICU',     dept: 'DEP-NICU',      ward: 'NICU Pods' },
  { id: 'LOC-JHCH-PICU',     dept: 'DEP-PICU',      ward: 'PICU Complex' },
  { id: 'LOC-RNC-OR',        dept: 'DEP-OR',        ward: 'RNC Theatres' },
  { id: 'LOC-RNC-CATH',      dept: 'DEP-CATH',      ward: 'RNC Cath Lab' },
  { id: 'LOC-RNC-CATHREC',   dept: 'DEP-CATH',      ward: 'RNC Cath Recovery' },
  { id: 'LOC-RNC-PARU',      dept: 'DEP-ANAES',     ward: 'RNC PACU' },
  { id: 'LOC-RNC-ENDO',      dept: 'DEP-ENDO',      ward: 'RNC Endoscopy' },
  { id: 'LOC-RNC-SAMEDAY',   dept: 'DEP-MED-ACUTE', ward: 'RNC Same Day' },
  { id: 'LOC-RNC-SDIPB',     dept: 'DEP-MED-ACUTE', ward: 'RNC Inpatient Beds' },
  { id: 'LOC-RNC-OPD-NORTH', dept: 'DEP-CHS',       ward: 'RNC North Clinics' },
  { id: 'LOC-RNC-OPD-SOUTH', dept: 'DEP-CHS',       ward: 'RNC South Clinics' },
  { id: 'LOC-JHH-PHYSIO',    dept: 'DEP-PHYSIO',    ward: 'JHH Physio Gym' },
  { id: 'LOC-RNC-PHYSIO',    dept: 'DEP-PHYSIO',    ward: 'RNC Hydrotherapy' },
  { id: 'LOC-BIOMED-WKS',    dept: 'DEP-BIOMED',    ward: 'Biomed Workshop' },
  { id: 'LOC-BIOMED-BEER',   dept: 'DEP-BEER',      ward: 'Biomed Loan Pool' }];
  
  let expandedAssetsOutput = [];
  let assetGlobalUidTracker = 50000; // Sequential ID base integer
  let procurementPoTracker = 92100;  // PO unique base integer
  
 // Dictionary mapping common blueprint titles to official GMDN generic classifications
const gmdnDictionary = {
  'monitor': 'Multi-parameter bedside patient monitor',
  'ventilator': 'Intensive care mechanical ventilator',
  'pump': 'Volumetric medical infusion pump',
  'defibrillator': 'Defibrillator/Monitor external bedside emergency system',
  'ultrasound': 'General-purpose diagnostic ultrasound imaging system',
  'ecg': 'Multichannel electrocardiograph',
  'humidifier': 'Respiratory gas humidification unit',
  'table': 'General-purpose operating theatre table',
  'light': 'Surgical overhead LED light system',
  'scanner': 'Bladder ultrasonic scanner portable console',
  'insufflator': 'Laparoscopic high-flow carbon dioxide insufflator',
  'reprocessor': 'Automated flexible endoscope decontamination washer',
  'analyzer': 'Biomedical electronic compliance calibration analyzer',
  'diathermy': 'High-frequency electrosurgical generator workstation',
  'platform': 'High-frequency electrosurgical generator workstation'
};

// Helper function assigning realistic alphanumeric manufacturer catalog data codes
function getAlphanumericRef(modelName) {
  const lower = modelName.toLowerCase();
  if (lower.includes('mx800')) return '865240';
  if (lower.includes('mx700')) return '865241';
  if (lower.includes('mx550')) return '865243';
  if (lower.includes('x3')) return '866060';
  if (lower.includes('x2')) return '865040';
  if (lower.includes('mx40')) return '865350';
  if (lower.includes('mx450')) return '865242';
  if (lower.includes('8100')) return '8100-USA-03';
  if (lower.includes('cc')) return '9001EL00';
  if (lower.includes('980')) return '980RESERVE';
  if (lower.includes('x series') || lower.includes('x-series')) return '601-2210-01';
  if (lower.includes('aed3') || lower.includes('aed 3')) return '8511-001010-01';
  if (lower.includes('airvo 2') || lower.includes('airvo2')) return '900PT560';
  if (lower.includes('airvo 3') || lower.includes('airvo3')) return '900PT600';
  if (lower.includes('vn500')) return '8414900';
  if (lower.includes('8000 plus')) return '2M20000';
  if (lower.includes('ft10')) return 'VLFT10GEN';
  if (lower.includes('vio 3') || lower.includes('vio3')) return '10160-000';
  if (lower.includes('n19')) return 'N19-MAIN';
  if (lower.includes('n1')) return 'N1-TRANS';
  if (lower.includes('g5')) return '161001';
  if (lower.includes('t1')) return '160005';
  if (lower.includes('tc50')) return '860315';
  if (lower.includes('r12')) return 'R12-A3';
  if (lower.includes('te7')) return 'TE7-MAX';
  if (lower.includes('cx50')) return 'M2540A';
  if (lower.includes('e10')) return 'V-E10-G4';
  if (lower.includes('pneumosure')) return '750-400-000';
  return 'REF-GEN-1001';
}

// Loop logic processing your master blueprints array programmatically
jhhLocations.forEach((location) => {
  const blueprintCollection = clinicalBlueprints[location.dept];
  if (!blueprintCollection) return;

  blueprintCollection.forEach((deviceType) => {
    procurementPoTracker++;
    const activePo = `PO-HNE-${procurementPoTracker}`;

    for (let index = 1; index <= deviceType.count; index++) {
      assetGlobalUidTracker++;
      
      // Calculate a randomized historical delivery date over the rolling 5-year window
      const deliveryYear = 2021 + Math.floor(Math.random() * 5);
      const deliveryMonth = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
      const deliveryDay = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
      const deliveryDateString = `${deliveryYear}-${deliveryMonth}-${deliveryDay}`;

      // 1. Enforce business validation rules for testing intervals (24 months for monitors, 12 otherwise)
      const isMonitor = deviceType.category.toLowerCase().includes('monitoring') || 
                        deviceType.title.toLowerCase().includes('monitor');
      const computedInterval = isMonitor ? 24 : 12;

      // 2. Extract standard clinical nomenclature title using our GMDN mapping dictionary
      const rawTitle = deviceType.title;
      let computedGmdnTitle = 'General Medical Device Equipment Asset';
      for (const [keyWord, gmdnTerm] of Object.entries(gmdnDictionary)) {
        if (rawTitle.toLowerCase().includes(keyWord)) {
          computedGmdnTitle = gmdnTerm;
          break;
        }
      }

      // 3. Formulate the streamlined 3NF dataset fields instance object mapping
      const assetRecordInstance = {
        asset_id: `${assetGlobalUidTracker}`,
        category: deviceType.category,
        title: computedGmdnTitle,              // Stored cleanly as the GMDN generic category descriptor
        model: rawTitle,                       // Stored cleanly as the whole model name (e.g., 'IntelliVue MX550')
        ref_number: getAlphanumericRef(rawTitle), // Stored cleanly as the specific alpha-numeric part number
        manufacturer: deviceType.manufacturer,
        supplier_vendor: deviceType.vendor,
        service_agent: deviceType.agent ? deviceType.agent : deviceType.vendor,
        delivery_date: deliveryDateString,
        purchase_order_number: activePo,
        location_id: location.id,
        sub_location: `${location.ward} - Target Bay ${String(index).padStart(2, '0')}`,
        image_name: `${deviceType.manufacturer}_${rawTitle}.jpg`.toLocaleLowerCase().replace(/\s/g, "_"),
        testing_interval: computedInterval,
        notes: `${deviceType.notes} Programmatically parsed structural inventory asset.`
      };

      expandedAssetsOutput.push(assetRecordInstance);
    }
  });
});

// Write data block directly to a local project file path
const destinationPath = path.join(process.cwd(), 'device_manifest.json');
fs.writeFileSync(destinationPath, JSON.stringify(expandedAssetsOutput, null, 2), 'utf-8');

console.log(`\n================================================================`);
console.log(`✅ DATA SHAPING AND EXTRACTION EXECUTION COMPLETE`);
console.log(`================================================================`);
console.log(`Successfully generated: ${expandedAssetsOutput.length} structured assets.`);
console.log(`File target destination:  ${destinationPath}\n`);