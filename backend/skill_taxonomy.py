SKILL_TAXONOMY = {
    "software_engineering": [
        "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", "Ruby",
        "Swift", "Kotlin", "PHP", "React", "Angular", "Vue.js", "Node.js", "Django",
        "Flask", "Spring Boot", "Express.js", "REST API Design", "GraphQL",
        "Microservices Architecture", "Data Structures", "Algorithms",
        "Object-Oriented Programming", "Functional Programming", "Git",
        "Unit Testing", "Integration Testing", "Test-Driven Development",
        "System Design", "Software Architecture", "Design Patterns",
        "Code Review", "Debugging", "Performance Optimization",
        "Mobile Development", "iOS Development", "Android Development",
        "WebSocket Programming", "Compiler Design",
    ],
    "data_science": [
        "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch",
        "Data Analysis", "Data Visualization", "Statistical Modeling",
        "Machine Learning", "Deep Learning", "Natural Language Processing",
        "Computer Vision", "TensorFlow", "PyTorch", "Scikit-learn",
        "Pandas", "NumPy", "R Programming", "Jupyter Notebooks",
        "Feature Engineering", "A/B Testing", "Hypothesis Testing",
        "Time Series Analysis", "Recommendation Systems",
        "Data Warehousing", "ETL Pipelines", "Apache Spark",
        "Hadoop", "Data Governance", "Business Intelligence",
    ],
    "product_management": [
        "Agile Methodologies", "Scrum", "Kanban", "Product Strategy",
        "Product Roadmapping", "User Story Writing", "Requirements Gathering",
        "Stakeholder Management", "Market Research", "Competitive Analysis",
        "Product Analytics", "KPI Definition", "OKR Framework",
        "Go-to-Market Strategy", "Feature Prioritization",
        "Customer Discovery", "User Interviews", "Product-Market Fit",
        "Pricing Strategy", "Product Lifecycle Management",
    ],
    "design_ux": [
        "User Interface Design", "User Experience Design", "Interaction Design",
        "Wireframing", "Prototyping", "Figma", "Sketch", "Adobe XD",
        "Design Systems", "Typography", "Color Theory", "Responsive Design",
        "Accessibility (WCAG)", "Usability Testing", "Information Architecture",
        "Visual Design", "Motion Design", "CSS", "HTML",
        "Design Thinking", "User Research", "Persona Development",
    ],
    "operations_logistics": [
        "Docker", "Kubernetes", "CI/CD Pipelines", "AWS", "Azure", "Google Cloud Platform",
        "Cloud Computing (AWS)", "Infrastructure as Code", "Terraform",
        "Ansible", "Jenkins", "GitHub Actions", "Linux Administration",
        "Network Security", "Monitoring & Observability", "Prometheus",
        "Grafana", "Log Management", "Incident Management",
        "Supply Chain Management", "Inventory Management",
        "Process Optimization", "Lean Management", "Six Sigma",
    ],
    "finance_accounting": [
        "Financial Analysis", "Financial Modeling", "Budgeting & Forecasting",
        "Corporate Finance", "Investment Analysis", "Risk Management",
        "Accounting Principles (GAAP)", "Tax Planning", "Audit & Compliance",
        "Excel Advanced (Financial)", "Financial Reporting",
        "Cost Analysis", "Revenue Recognition", "Cash Flow Management",
        "Mergers & Acquisitions", "Venture Capital", "Portfolio Management",
        "Blockchain & Cryptocurrency", "RegTech", "Anti-Money Laundering",
    ],
}

def get_all_skills() -> list[str]:
    """Return flat list of all taxonomy skills."""
    skills = []
    for domain_skills in SKILL_TAXONOMY.values():
        skills.extend(domain_skills)
    return skills

def get_skill_domain(skill_name: str) -> str:
    """Find which domain a skill belongs to."""
    for domain, skills in SKILL_TAXONOMY.items():
        if skill_name in skills:
            return domain
    return "software_engineering"
