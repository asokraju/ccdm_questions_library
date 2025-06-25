# **CLINICAL DATA MANAGEMENT INTERVIEW PREPARATION**
## **Section 1: Clinical Data Management Fundamentals**

### **Primary Q&A:**
**Q: Walk me through your understanding of the clinical data management lifecycle from study startup to database lock.**

**A:** The CDM lifecycle begins with protocol review and CRF design, where I ensure data collection aligns with study objectives. During startup, I develop the Data Management Plan, design eCRFs, and program edit checks. Throughout the study, I monitor data quality, manage queries, and reconcile external vendor data. The process culminates in database lock after ensuring all data is clean, queries resolved, and reconciliation complete. At SCHARP, I've led 35+ studies through this entire lifecycle, consistently meeting or beating timelines.

### **Anticipated Follow-up Questions:**

**Follow-up 1: You mentioned leading 35+ studies. Can you give me a specific example of a challenging study you managed from start to finish?**

**A:** One of my most challenging studies was a multi-site HIV prevention trial at SCHARP with 12 global sites across different time zones and languages. The complexity involved managing sites in sub-Saharan Africa with limited internet connectivity. I developed an offline data entry solution and established regional data coordinators. Despite infrastructure challenges, we achieved 98% data completeness and locked the database on schedule. The key was creating site-specific workflows and maintaining frequent communication through regional leads.

**Follow-up 2: How do you prioritize when managing multiple studies in different phases simultaneously?**

**A:** I use a risk-based prioritization matrix considering: regulatory milestones, patient safety data, sponsor commitments, and study phase. For example, I always prioritize Phase 1 safety data and database locks over routine Phase 4 monitoring. I maintain a master timeline that I review daily, and I've trained my team of 2 DMs and 5 CDCs to handle routine tasks independently. This allows me to focus on critical decision points while ensuring nothing falls through the cracks.

**Follow-up 3: What specific steps do you take during CRF design to ensure quality data collection?**

**A:** I start with a protocol deep-dive, creating a data flow diagram to identify all data points. Then I:
1. Design fields with appropriate constraints (ranges, formats, mandatory fields)
2. Create skip logic to prevent irrelevant data entry
3. Build in real-time calculations for derived fields
4. Develop completion guidelines with examples
5. Conduct user acceptance testing with actual site coordinators

At American Science Labs, this approach reduced our query rate by 25% because sites could enter clean data from day one.

---

## **Section 2: Oncology-Specific Experience**

### **Primary Q&A:**
**Q: What unique challenges have you encountered in oncology trials compared to other therapeutic areas?**

**A:** Oncology trials present unique challenges including complex dosing regimens, frequent protocol amendments due to safety findings, and extensive adverse event data. Managing tumor response assessments (RECIST criteria) requires careful attention to imaging data reconciliation. At Fred Hutchinson Cancer Research Center, I've managed oncology studies where I coordinated with Safety Monitoring Committees and ensured rapid processing of SAE data, understanding that patient safety is paramount in cancer trials.

### **Anticipated Follow-up Questions:**

**Follow-up 1: Can you explain your experience with RECIST criteria and tumor assessment data?**

**A:** I've managed studies using RECIST 1.1 criteria where we collected baseline and follow-up imaging data. The challenge is ensuring consistent measurement reporting across different radiologists and sites. I developed a specialized CRF module that enforced RECIST rules - for example, automatically calculating sum of diameters and determining response categories. I also established a reconciliation process between local and central reads, flagging discrepancies >20% for immediate review. This systematic approach ensured regulatory compliance and data integrity for efficacy endpoints.

**Follow-up 2: How do you handle protocol amendments in ongoing oncology studies?**

**A:** Oncology studies often have safety-driven amendments. I've managed situations where we needed to implement changes within 48 hours. My process includes:
1. Impact assessment on existing data
2. Creating amendment-specific edit checks
3. Updating eCRFs with version control
4. Site notification and training
5. Data migration planning if needed

For instance, when a dose de-escalation was required in one study, I implemented the changes within 24 hours while maintaining complete audit trails and ensuring no data loss.

**Follow-up 3: Describe your experience with Safety Monitoring Committees in oncology trials.**

**A:** I've prepared data packages for DMC/SMC reviews, typically on accelerated timelines. This includes creating safety run-in reports, adverse event summaries, and lab abnormality listings. I coordinate with biostatistics to ensure data cuts are accurate and complete. For one oncology study, I established a 48-hour turnaround process for unblinded safety data, which required careful access controls and workflow management. The key is having pre-programmed reports ready and maintaining extremely clean data so reviews aren't delayed.

---

## **Section 3: Regulatory Compliance & Standards**

### **Primary Q&A:**
**Q: How do you ensure ICH-GCP compliance in your daily work?**

**A:** I maintain compliance by following established SOPs, ensuring complete audit trails, and maintaining comprehensive documentation. I've led reviews and updates of departmental SOPs at SCHARP to ensure continued compliance. I also ensure data integrity through proper access controls, regular training updates, and maintaining Trial Master Files. My work consistently passes both internal and external audits.

### **Anticipated Follow-up Questions:**

**Follow-up 1: Tell me about a time you identified and corrected a GCP compliance issue.**

**A:** During a routine review, I discovered that some sites were using an outdated informed consent form version for screening visits. I immediately implemented a corrective action plan:
1. Halted enrollment at affected sites
2. Conducted impact assessment (fortunately, no subjects were enrolled)
3. Implemented a version control check in the EDC system
4. Created a reconciliation report between consent versions and subject visits
5. Retrained sites on document control

This proactive approach prevented a major protocol deviation and was commended during our next audit.

**Follow-up 2: What's your experience with regulatory audits and inspections?**

**A:** I've supported 6 regulatory inspections, including FDA and EMA audits. My role involved:
- Preparing inspection-ready documentation
- Creating data listings and patient profiles
- Serving as the CDM SME during inspections
- Addressing data-related findings

In one FDA inspection, the auditor questioned our query resolution timelines. I demonstrated our metrics showing 3-day median resolution time and explained our escalation process. The inspector was satisfied, and we received no data management findings.

**Follow-up 3: How do you stay current with changing regulations?**

**A:** I maintain several approaches:
1. Regular review of FDA and ICH guidance documents
2. Participation in DIA and SCDM webinars
3. Internal training sessions at SCHARP
4. Collaboration with regulatory affairs colleagues
5. Industry newsletter subscriptions

When ICH E6(R2) was implemented, I led our team's gap analysis and SOP updates, ensuring we incorporated risk-based monitoring approaches into our processes.

---

## **Section 4: EDC Systems & Technical Knowledge**

### **Primary Q&A:**
**Q: Describe your experience with different EDC platforms. How do you adapt to new systems?**

**A:** I have extensive experience with Medidata RAVE, Oracle Clinical, and OCRDC. When adapting to new systems, I focus on understanding the core functionalities first - how to build forms, create edit checks, and manage queries. I leverage my fundamental CDM knowledge which translates across platforms. When we transitioned between EDC systems at American Science Labs, I quickly became proficient by focusing on the business processes rather than just the technical aspects.

### **Anticipated Follow-up Questions:**

**Follow-up 1: Which EDC system do you prefer and why?**

**A:** Each system has strengths. Medidata RAVE excels in user interface and integration capabilities - I particularly value its Coder integration for adverse event coding. Oracle Clinical offers robust data extraction and reporting features. However, I believe the key is not the system itself but how well it's configured. I've seen poorly designed studies in excellent systems and vice versa. My focus is always on optimizing whatever platform we're using to meet study needs efficiently.

**Follow-up 2: How do you handle EDC migrations or transitions between systems?**

**A:** I've managed two major EDC migrations. The process requires:
1. Detailed mapping of data fields between systems
2. Validation of all edit checks and derivations
3. Comprehensive UAT with parallel runs
4. Change control documentation
5. Site retraining

During one migration from Oracle to RAVE, I identified that date formats handled calculations differently. We caught this during UAT and adjusted our specifications, preventing data corruption. The key is never assuming systems work identically - every detail must be verified.

**Follow-up 3: What's your approach to training sites on EDC systems?**

**A:** I develop role-based training focusing on practical scenarios rather than system features. My approach includes:
1. Pre-training system access verification
2. Study-specific training materials with screenshots
3. Hands-on practice in training environment
4. Common errors guide based on past studies
5. Quick reference cards for site staff

I also establish "office hours" during the first month where sites can ask questions. This proactive support reduced our query rate by 30% in the studies where I implemented it.

---

## **Section 5: Leadership & Process Improvement**

### **Primary Q&A:**
**Q: Tell me about a process improvement you've implemented.**

**A:** I standardized multilingual CRF templates at SCHARP and renegotiated translation vendor contracts, which cut translation costs by 35% (~$120K/year) and reduced CRF release time by 5 days per study. I identified inefficiencies in our existing process, researched best practices, and implemented a template library with pre-approved translations for common data fields. This improvement has been adopted program-wide.

### **Anticipated Follow-up Questions:**

**Follow-up 1: How did you get buy-in from stakeholders for this change?**

**A:** I started by documenting the current state - showing that we were retranslating identical fields across studies. I then:
1. Calculated the financial impact (~$120K annual savings)
2. Demonstrated timeline improvements (5 days per study)
3. Piloted with one study to prove the concept
4. Addressed concerns about flexibility by maintaining custom translation options
5. Presented to leadership with clear ROI metrics

The pilot's success made stakeholder buy-in straightforward. The key was showing concrete benefits rather than theoretical improvements.

**Follow-up 2: What challenges did you face during implementation?**

**A:** The main challenges were:
1. **Resistance to change** - Some PMs preferred their specific translations. I addressed this by involving them in creating the standard library
2. **Vendor pushback** - They lost revenue from repeated translations. I negotiated a volume-based contract that maintained their overall revenue
3. **System integration** - Our EDC needed updates to use template libraries. I worked with IT to phase implementation
4. **Version control** - Managing updates to the standard library. I established a governance committee with quarterly reviews

Each challenge became an opportunity to refine the process.

**Follow-up 3: How do you measure the success of process improvements?**

**A:** I establish baseline metrics before implementation and track:
1. **Quantitative measures**: Cost savings, time reduction, error rates
2. **Qualitative measures**: User satisfaction surveys, adoption rates
3. **Long-term indicators**: Audit findings, sponsor feedback

For the CRF standardization, I tracked:
- Translation costs (35% reduction achieved)
- CRF release timelines (5-day improvement)
- Translation error rates (decreased by 60%)
- PM satisfaction scores (increased from 3.2 to 4.5/5)

I present these metrics quarterly to ensure sustained improvement.

---

## **Section 6: Vendor & Stakeholder Management**

### **Primary Q&A:**
**Q: How do you handle external vendor data integration?**

**A:** I establish clear data transfer specifications upfront and regular reconciliation schedules. I've managed integrations with lab vendors, eCOA systems, IRT, and imaging vendors. At SCHARP, I developed standardized processes for eCOA-EDC reconciliation that improved consistency. I maintain strong relationships with vendor contacts, conduct regular reconciliation meetings, and ensure ≥98% discrepancy resolution before database lock.

### **Anticipated Follow-up Questions:**

**Follow-up 1: Describe a challenging vendor integration issue and how you resolved it.**

**A:** We had a central lab vendor suddenly change their data format mid-study without notice. This caused our automated reconciliation to fail, affecting 3 studies. I:
1. Immediately escalated to vendor management
2. Created manual reconciliation processes as a stopgap
3. Worked with their IT team to understand the changes
4. Updated our specifications and revalidated the integration
5. Implemented change control notifications in our vendor contracts

We resolved it within 72 hours with no data loss. This experience led me to implement vendor integration testing as part of our monthly processes.

**Follow-up 2: How do you manage vendor relationships when there are performance issues?**

**A:** I believe in collaborative problem-solving while maintaining accountability. When a lab vendor consistently missed data transfer deadlines, I:
1. Documented the issues with specific metrics
2. Scheduled a partnership meeting (not a "complaint session")
3. Worked together to identify root causes
4. Developed mutual action plans with clear timelines
5. Implemented weekly check-ins until resolution
6. Established SLA penalties for future contracts

The key is maintaining professionalism while firmly advocating for study needs. This approach has salvaged several vendor relationships that others had written off.

**Follow-up 3: What's your approach to vendor selection and qualification?**

**A:** While I don't always control vendor selection, I contribute by:
1. Developing technical requirements based on study needs
2. Participating in vendor capability assessments
3. Reviewing previous performance metrics
4. Testing integration capabilities during selection
5. Ensuring clear data specifications in contracts

For a recent eCOA vendor selection, I identified that one vendor's API couldn't handle our visit schedule complexity. This technical input prevented a costly mistake. I maintain a vendor performance database that helps inform future selections.

---

## **Section 7: Situational/Behavioral Questions**

### **Primary Q&A:**
**Q: Describe a time when you had to handle a critical data issue close to database lock.**

**A:** During a Phase 3 diabetes trial at American Science Labs, we discovered a systematic lab data transmission error just days before planned lock. I immediately assembled the team, conducted root cause analysis, and developed a remediation plan. We worked extended hours to reprocess the affected data, validate corrections, and update documentation. By maintaining clear communication with the sponsor and implementing parallel workflows, we achieved database lock only 2 days behind schedule while ensuring complete data integrity.

### **Anticipated Follow-up Questions:**

**Follow-up 1: How did you communicate this delay to the sponsor?**

**A:** I believed in immediate, transparent communication. Within 2 hours of discovering the issue, I:
1. Called the sponsor's project manager directly
2. Provided a clear summary: what happened, impact assessment, proposed solution
3. Offered options: delay lock for full resolution or proceed with limitations
4. Presented a detailed timeline with daily milestones
5. Scheduled daily update calls

The sponsor appreciated the transparency and approved our remediation plan. They later commended our handling of the crisis in their vendor evaluation.

**Follow-up 2: What would you do differently if this situation arose again?**

**A:** While we handled the crisis well, I implemented preventive measures:
1. Monthly vendor data quality checks (not just at milestones)
2. Automated alerts for data transmission anomalies
3. Pre-lock data audits starting 30 days out
4. Vendor integration testing after any system updates
5. Clear escalation pathways in vendor contracts

I believe in learning from every challenge. This experience made me a stronger advocate for proactive monitoring rather than reactive problem-solving.

**Follow-up 3: How did you keep your team motivated during this high-pressure situation?**

**A:** Team morale was crucial during those intense 72 hours. I:
1. Clearly communicated the importance and impact of our work
2. Broke the work into manageable shifts to prevent burnout
3. Provided meals and arranged transportation for late hours
4. Publicly recognized individual contributions
5. Maintained a solutions-focused atmosphere
6. Celebrated small victories throughout the process

After resolution, I ensured the team received recognition from senior management and contributed to their performance reviews. The team's dedication was remarkable, and several members cited this experience as career-defining.

---

## **Section 8: Eli Lilly Specific Questions**

### **Primary Q&A:**
**Q: Why do you want to work for Eli Lilly?**

**A:** Eli Lilly's commitment to oncology research aligns perfectly with my experience at Fred Hutchinson Cancer Research Center. I'm passionate about contributing to breakthrough therapies that improve patient lives. Lilly's reputation for innovation, quality, and ethical standards matches my professional values. Additionally, the opportunity to work with cutting-edge oncology programs while applying my extensive CDM expertise to help bring life-saving treatments to market faster is incredibly motivating.

### **Anticipated Follow-up Questions:**

**Follow-up 1: What specific aspects of Lilly's oncology pipeline interest you?**

**A:** While I respect the confidentiality of pipeline details, I'm particularly interested in Lilly's approach to precision medicine and immunotherapy. My experience managing biomarker-driven trials at SCHARP has prepared me for the complexity of personalized medicine studies. I'm excited about the challenge of managing companion diagnostic data alongside clinical data, ensuring the integrity of both efficacy and patient selection endpoints. The prospect of contributing to therapies that could transform cancer treatment paradigms is deeply meaningful to me.

**Follow-up 2: How do you see yourself contributing to Lilly's data management team?**

**A:** I bring three key contributions:
1. **Operational Excellence**: My track record of managing 35+ studies efficiently while maintaining quality
2. **Process Innovation**: Like my CRF standardization saving $120K annually, I constantly seek improvements
3. **Team Development**: My experience training and mentoring 7 team members can help build Lilly's talent pipeline

Specifically, I could help optimize oncology study startup timelines and enhance vendor integration processes. My experience with global sites would also support Lilly's international trials.

**Follow-up 3: Where do you see your career progressing at Lilly?**

**A:** Short-term, I want to become a trusted CDM expert within Lilly's oncology division, known for delivering quality data on time. Medium-term, I'd like to lead process improvements across the data management group, perhaps standardizing oncology-specific data collection methods. Long-term, I aspire to a senior leadership role where I can influence data strategy for Lilly's entire oncology portfolio. I'm also interested in contributing to industry standards through Lilly's participation in groups like CDISC or TransCelerate.

---

## **CRITICAL REMINDERS FOR INTERVIEW SUCCESS:**

1. **Always have specific examples ready** - Never make claims you can't support with real scenarios
2. **Show impact through metrics** - Quantify improvements wherever possible
3. **Demonstrate learning agility** - Show how you've grown from challenges
4. **Research Lilly's current news** - Check their website the day before for any announcements
5. **Prepare questions to ask them** - Shows genuine interest and engagement
6. **Practice the STAR method** - Situation, Task, Action, Result for behavioral questions
7. **Stay positive** - Even when discussing challenges, focus on solutions and learning

Remember: Every follow-up question is an opportunity to demonstrate depth of experience. Be prepared to go 3-4 levels deep on any topic you introduce.

