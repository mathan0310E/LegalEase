"""Default legal document templates and prompt definitions for LegalEase."""

DOCUMENT_TEMPLATES = [
    {
        "name": "Non-Disclosure Agreement (NDA)",
        "document_type": "nda",
        "description": "Standard mutual or unilateral non-disclosure agreement to protect confidential business, technical, or financial information.",
        "category": "Confidentiality",
        "fields_schema": [
            {"name": "agreement_type", "label": "Agreement Type", "field_type": "select", "required": True, "options": ["Mutual (Two-way)", "Unilateral (Disclosing to Receiving)"], "default": "Mutual (Two-way)", "placeholder": "", "help_text": "Specifies if both parties or only one party exchanges confidential data."},
            {"name": "disclosing_party", "label": "Disclosing / First Party Name", "field_type": "text", "required": True, "placeholder": "Acme Innovations Inc.", "help_text": "Legal entity or individual disclosing confidential information."},
            {"name": "disclosing_party_jurisdiction", "label": "First Party Jurisdiction/Address", "field_type": "text", "required": True, "placeholder": "Delaware, USA or Chennai, Tamil Nadu, India", "help_text": "Registered state or country."},
            {"name": "receiving_party", "label": "Receiving / Second Party Name", "field_type": "text", "required": True, "placeholder": "Apex Solutions LLC", "help_text": "Legal entity or individual receiving confidential information."},
            {"name": "receiving_party_jurisdiction", "label": "Second Party Jurisdiction/Address", "field_type": "text", "required": True, "placeholder": "Bangalore, Karnataka, India", "help_text": "Registered state or country."},
            {"name": "effective_date", "label": "Effective Date", "field_type": "date", "required": True, "placeholder": "", "help_text": "Date the agreement takes legal effect."},
            {"name": "purpose", "label": "Permitted Purpose", "field_type": "textarea", "required": True, "placeholder": "Evaluating a potential strategic technology partnership and commercial integration.", "help_text": "The exact scope for which the confidential information may be used."},
            {"name": "duration_months", "label": "Confidentiality Duration (Months)", "field_type": "number", "required": True, "default": "24", "placeholder": "24", "help_text": "Number of months the confidentiality obligations remain active."},
            {"name": "governing_law", "label": "Governing Law / Jurisdiction", "field_type": "text", "required": True, "placeholder": "Courts of Tamil Nadu, India", "help_text": "The jurisdiction whose laws govern this agreement."},
            {"name": "remedies_injunction", "label": "Include Injunctive Relief", "field_type": "select", "required": False, "options": ["Yes", "No"], "default": "Yes", "placeholder": "", "help_text": "Entitlement to seek court injunctions upon breach."}
        ]
    },
    {
        "name": "Employment Agreement",
        "document_type": "employment_agreement",
        "description": "Comprehensive full-time employment agreement covering job responsibilities, compensation, benefits, IP assignment, and termination.",
        "category": "Human Resources",
        "fields_schema": [
            {"name": "employer_name", "label": "Employer Company Name", "field_type": "text", "required": True, "placeholder": "TechCorp Private Limited", "help_text": "Legal employer organization name."},
            {"name": "employer_address", "label": "Employer Address", "field_type": "text", "required": True, "placeholder": "100 Tech Park, T. Nagar, Chennai, India", "help_text": "Headquarters or registered branch."},
            {"name": "employee_name", "label": "Employee Full Name", "field_type": "text", "required": True, "placeholder": "Jane Doe", "help_text": "Full legal name as per government ID."},
            {"name": "job_title", "label": "Designation / Job Title", "field_type": "text", "required": True, "placeholder": "Senior Software Architect", "help_text": "Official job title."},
            {"name": "start_date", "label": "Start Date", "field_type": "date", "required": True, "placeholder": "", "help_text": "Employee joining date."},
            {"name": "employment_type", "label": "Employment Type", "field_type": "select", "required": True, "options": ["Full-Time", "Part-Time", "Contract-to-Hire"], "default": "Full-Time", "placeholder": "", "help_text": "Working arrangement."},
            {"name": "compensation", "label": "Annual Salary / Compensation", "field_type": "text", "required": True, "placeholder": "₹1,800,000 per annum ($120,000 USD)", "help_text": "Gross pay details."},
            {"name": "probation_period_months", "label": "Probation Period (Months)", "field_type": "number", "required": False, "default": "3", "placeholder": "3", "help_text": "Standard probation timeframe."},
            {"name": "notice_period_days", "label": "Notice Period (Days)", "field_type": "number", "required": True, "default": "30", "placeholder": "30", "help_text": "Required resignation / termination notice in days."},
            {"name": "governing_law", "label": "Governing Law", "field_type": "text", "required": True, "placeholder": "Tamil Nadu, India", "help_text": "Applicable state/national labor jurisdiction."}
        ]
    },
    {
        "name": "Offer Letter",
        "document_type": "offer_letter",
        "description": "Formal job offer letter outlining compensation, role, joining details, and contingency conditions.",
        "category": "Human Resources",
        "fields_schema": [
            {"name": "company_name", "label": "Company Name", "field_type": "text", "required": True, "placeholder": "Innovate Global Ltd", "help_text": "Hiring company name."},
            {"name": "candidate_name", "label": "Candidate Name", "field_type": "text", "required": True, "placeholder": "John Smith", "help_text": "Prospective employee."},
            {"name": "position", "label": "Offered Position", "field_type": "text", "required": True, "placeholder": "Lead Product Manager", "help_text": "Role title."},
            {"name": "reporting_to", "label": "Reporting To", "field_type": "text", "required": True, "placeholder": "VP of Engineering", "help_text": "Supervisor or department head."},
            {"name": "offered_ctc", "label": "Total Compensation (CTC)", "field_type": "text", "required": True, "placeholder": "₹2,400,000 per annum + 10% performance bonus", "help_text": "Gross salary breakdown."},
            {"name": "joining_date", "label": "Joining Date", "field_type": "date", "required": True, "placeholder": "", "help_text": "Expected start date."},
            {"name": "acceptance_deadline", "label": "Offer Acceptance Deadline", "field_type": "date", "required": True, "placeholder": "", "help_text": "Date by which the candidate must sign and return."},
            {"name": "work_location", "label": "Work Location", "field_type": "text", "required": True, "placeholder": "Hybrid - Chennai Office / Remote", "help_text": "Office or remote work stipulations."}
        ]
    },
    {
        "name": "Service Agreement",
        "document_type": "service_agreement",
        "description": "B2B or client services master contract defining deliverables, payment milestones, SLA, and liability limits.",
        "category": "Business",
        "fields_schema": [
            {"name": "client_name", "label": "Client Organization", "field_type": "text", "required": True, "placeholder": "Alpha Enterprises", "help_text": "Entity procuring the services."},
            {"name": "provider_name", "label": "Service Provider", "field_type": "text", "required": True, "placeholder": "Nexus Cloud Consulting", "help_text": "Entity delivering the services."},
            {"name": "services_scope", "label": "Scope of Services", "field_type": "textarea", "required": True, "placeholder": "Cloud migration, architectural audit, and 24/7 infrastructure monitoring.", "help_text": "Detailed deliverables and milestones."},
            {"name": "effective_date", "label": "Effective Date", "field_type": "date", "required": True, "placeholder": "", "help_text": "Agreement commencement date."},
            {"name": "fees_and_milestones", "label": "Payment Terms & Fees", "field_type": "textarea", "required": True, "placeholder": "₹350,000 due upon signing, ₹350,000 upon staging signoff (Net 15 days).", "help_text": "Pricing schedule and payment terms."},
            {"name": "term_duration", "label": "Term Duration", "field_type": "text", "required": True, "placeholder": "6 months with optional renewal", "help_text": "Duration of engagement."},
            {"name": "termination_notice_days", "label": "Termination Notice (Days)", "field_type": "number", "required": True, "default": "30", "placeholder": "30", "help_text": "Notice required for termination without cause."},
            {"name": "governing_law", "label": "Governing Law", "field_type": "text", "required": True, "placeholder": "State of Tamil Nadu, India", "help_text": "Jurisdiction."}
        ]
    },
    {
        "name": "Freelance Agreement",
        "document_type": "freelance_agreement",
        "description": "Contract for independent contractors and freelancers clarifying work ownership, milestones, and tax status.",
        "category": "Freelance & Consulting",
        "fields_schema": [
            {"name": "client_name", "label": "Client Name", "field_type": "text", "required": True, "placeholder": "Horizon Media Agency", "help_text": "Contracting party."},
            {"name": "contractor_name", "label": "Freelancer / Contractor Name", "field_type": "text", "required": True, "placeholder": "Alex Rivera", "help_text": "Individual contractor."},
            {"name": "project_description", "label": "Project Deliverables", "field_type": "textarea", "required": True, "placeholder": "Design and development of 5 custom interactive web dashboards.", "help_text": "Specifications of deliverables."},
            {"name": "project_rate", "label": "Payment / Fixed Rate", "field_type": "text", "required": True, "placeholder": "₹120,000 fixed milestone price ($1,500 USD)", "help_text": "Agreed compensation."},
            {"name": "delivery_deadline", "label": "Target Completion Date", "field_type": "date", "required": True, "placeholder": "", "help_text": "Delivery deadline."},
            {"name": "revisions_included", "label": "Revisions Included", "field_type": "number", "required": False, "default": "2", "placeholder": "2", "help_text": "Number of design/code review iterations."},
            {"name": "ip_transfer", "label": "IP Ownership Transfer", "field_type": "select", "required": True, "options": ["Transfers fully to Client upon full payment", "Contractor retains IP with perpetual client license"], "default": "Transfers fully to Client upon full payment", "placeholder": "", "help_text": "Intellectual property ownership rights."},
            {"name": "governing_law", "label": "Governing Law", "field_type": "text", "required": True, "placeholder": "Tamil Nadu, India", "help_text": "Jurisdiction."}
        ]
    },
    {
        "name": "Lease Agreement",
        "document_type": "lease_agreement",
        "description": "Residential or commercial property rental lease specifying rent, security deposit, maintenance, and rules.",
        "category": "Real Estate",
        "fields_schema": [
            {"name": "landlord_name", "label": "Landlord / Lessor Full Name", "field_type": "text", "required": True, "placeholder": "Robert Vance", "help_text": "Property owner."},
            {"name": "tenant_name", "label": "Tenant / Lessee Full Name", "field_type": "text", "required": True, "placeholder": "Sarah Connor", "help_text": "Renter/occupant."},
            {"name": "property_address", "label": "Leased Property Address", "field_type": "textarea", "required": True, "placeholder": "Flat 4B, Emerald Heights, Anna Nagar, Chennai - 600040", "help_text": "Complete property description."},
            {"name": "lease_start_date", "label": "Lease Start Date", "field_type": "date", "required": True, "placeholder": "", "help_text": "Commencement date."},
            {"name": "lease_period_months", "label": "Lease Period (Months)", "field_type": "number", "required": True, "default": "11", "placeholder": "11", "help_text": "Typically 11 months or multi-year."},
            {"name": "monthly_rent", "label": "Monthly Rent Amount", "field_type": "text", "required": True, "placeholder": "₹35,000 per month", "help_text": "Due on the 5th of each calendar month."},
            {"name": "security_deposit", "label": "Security Deposit", "field_type": "text", "required": True, "placeholder": "₹200,000 (Refundable)", "help_text": "Interest-free refundable deposit."},
            {"name": "maintenance_charges", "label": "Maintenance / Utilities", "field_type": "text", "required": False, "placeholder": "₹3,500 monthly society maintenance payable by Tenant", "help_text": "Association dues."},
            {"name": "notice_period_months", "label": "Notice Period (Months)", "field_type": "number", "required": True, "default": "2", "placeholder": "2", "help_text": "Advance notice for vacating."},
            {"name": "governing_law", "label": "Governing Jurisdiction", "field_type": "text", "required": True, "placeholder": "Chennai, Tamil Nadu, India", "help_text": "Jurisdiction."}
        ]
    },
    {
        "name": "Partnership Agreement",
        "document_type": "partnership_agreement",
        "description": "General business partnership agreement covering capital contributions, profit/loss sharing, voting rights, and dissolution.",
        "category": "Business",
        "fields_schema": [
            {"name": "partnership_name", "label": "Partnership Firm Name", "field_type": "text", "required": True, "placeholder": "Vanguard Capital Partners", "help_text": "Business name."},
            {"name": "partner_1_name", "label": "Partner 1 Name & Contribution", "field_type": "text", "required": True, "placeholder": "Alice Walker (50% Equity, ₹1,000,000 capital)", "help_text": "First partner and capital ratio."},
            {"name": "partner_2_name", "label": "Partner 2 Name & Contribution", "field_type": "text", "required": True, "placeholder": "Bob Williams (50% Equity, ₹1,000,000 capital)", "help_text": "Second partner and capital ratio."},
            {"name": "business_purpose", "label": "Principal Business Activity", "field_type": "textarea", "required": True, "placeholder": "Providing institutional financial advisory and automated portfolio analytics.", "help_text": "Scope of the partnership business."},
            {"name": "commencement_date", "label": "Commencement Date", "field_type": "date", "required": True, "placeholder": "", "help_text": "Effective start date."},
            {"name": "profit_sharing_ratio", "label": "Profit & Loss Distribution", "field_type": "text", "required": True, "placeholder": "50% to Partner 1, 50% to Partner 2", "help_text": "Distribution ratio."},
            {"name": "decision_making", "label": "Decision-Making Rule", "field_type": "select", "required": True, "options": ["Unanimous consent required for all major decisions", "Majority vote (greater than 50%)"], "default": "Unanimous consent required for all major decisions", "placeholder": "", "help_text": "Voting threshold."},
            {"name": "governing_law", "label": "Governing Law", "field_type": "text", "required": True, "placeholder": "Tamil Nadu, India", "help_text": "Jurisdiction."}
        ]
    },
    {
        "name": "General Legal Agreement",
        "document_type": "general_legal_agreement",
        "description": "Flexible multi-purpose bilateral legal contract adaptable for settlements, licensing, memorandums, or mutual obligations.",
        "category": "General",
        "fields_schema": [
            {"name": "agreement_title", "label": "Agreement Title", "field_type": "text", "required": True, "placeholder": "Mutual Collaboration and Resource Sharing Agreement", "help_text": "Formal title of the agreement."},
            {"name": "party_a", "label": "First Party Name & Details", "field_type": "text", "required": True, "placeholder": "Solaris Energy Corp (incorporated in Delaware)", "help_text": "First contracting party."},
            {"name": "party_b", "label": "Second Party Name & Details", "field_type": "text", "required": True, "placeholder": "GreenTech Innovations Ltd (incorporated in Chennai)", "help_text": "Second contracting party."},
            {"name": "effective_date", "label": "Effective Date", "field_type": "date", "required": True, "placeholder": "", "help_text": "Commencement date."},
            {"name": "core_obligations", "label": "Core Terms and Reciprocal Obligations", "field_type": "textarea", "required": True, "placeholder": "Party A shall supply hardware prototypes; Party B shall develop the embedded firmware within 90 days.", "help_text": "Main covenants and responsibilities."},
            {"name": "term_duration", "label": "Agreement Duration", "field_type": "text", "required": True, "placeholder": "1 year from effective date", "help_text": "Term of validity."},
            {"name": "dispute_resolution", "label": "Dispute Resolution Method", "field_type": "select", "required": True, "options": ["Binding Arbitration in Chennai, India", "Courts of competent jurisdiction", "Mediation followed by Arbitration"], "default": "Binding Arbitration in Chennai, India", "placeholder": "", "help_text": "Dispute mechanism."},
            {"name": "governing_law", "label": "Governing Law", "field_type": "text", "required": True, "placeholder": "Laws of India", "help_text": "Jurisdiction."}
        ]
    }
]
