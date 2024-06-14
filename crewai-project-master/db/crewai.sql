CREATE DATABASE IF NOT EXISTS crewai;
USE crewai;

CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id VARCHAR(36) UNIQUE NOT NULL,
    status VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id VARCHAR(36) NOT NULL,
    result TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(job_id)
);

CREATE TABLE IF NOT EXISTS agents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role TEXT,
    goal TEXT,
    backstory TEXT,
    llm VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    agent_id INT NOT NULL,
    tools TEXT,
    expected_output TEXT,
    FOREIGN KEY (agent_id) REFERENCES agents(id)
);

CREATE TABLE IF NOT EXISTS crews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    verbose BOOLEAN DEFAULT FALSE,
    managellm VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS crew_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    crew_id INT NOT NULL,
    task_id INT NOT NULL,
    FOREIGN KEY (crew_id) REFERENCES crews(id),
    FOREIGN KEY (task_id) REFERENCES tasks(id)
);

CREATE TABLE IF NOT EXISTS crew_agents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    crew_id INT NOT NULL,
    agent_id INT NOT NULL,
    FOREIGN KEY (crew_id) REFERENCES crews(id),
    FOREIGN KEY (agent_id) REFERENCES agents(id)
);

-- 插入 Agent 数据
INSERT INTO agents (name, role, goal, backstory, llm) VALUES
('Company Research Manager', 'Company Research Manager',
'Generate a list of JSON objects containing the urls for 3 recent blog articles and the url and title for 3 recent YouTube interview, for each position in each company. Important: - The final list of JSON objects must include all companies and positions. Do not leave any out. - If you can not find information for a specific position, fill in the information with the word "MISSING". - Do not generate fake information. Only return the information you find. Nothing else! - Do not stop researching until you find the requested information for each position in each company. - All the companies and positions exist so keep researching until you find the information for each one. - Make sure you each researched position for each company contains 3 blog articles and 3 YouTube interviews.',
'As a Company Research Manager, you are responsible for aggregating all the researched information into a list.',
'');

INSERT INTO agents (name, role, goal, backstory, llm) VALUES
('Company Research Agent', 'Company Research Agent',
'Look up the specific positions for a given company and find urls for 3 recent blog articles and the url and title for 3 recent YouTube interview for each person in the specified positions. Important: - Once you\'ve found the information, immediately stop searching for additional information. - Only return the requested information. NOTHING ELSE! - Make sure you find the persons name who holds the position. - Do not generate fake information. Only return the information you find. Nothing else!',
'As a Company Research Agent, you are responsible for looking up specific positions within a company and gathering relevant information.',
'');

-- 获取刚插入的 Agent ID
SET @manager_id = (SELECT id FROM agents WHERE name = 'Company Research Manager');
SET @agent_id = (SELECT id FROM agents WHERE name = 'Company Research Agent');

-- 插入 Task 数据
INSERT INTO tasks (name, description, agent_id, tools, expected_output) VALUES
('Company Analyse Search Task',
'Collect comprehensive information and data about the company "{company_name}" for detailed analysis. The data is preferably cutting-edge, authoritative, and significant. This task involves gathering financial reports, market data, and any relevant information to understand the company\'s position in the market and its competitive landscape. Your final report should include detailed findings and data about the company\'s financial performance, market share, key competitors, and any other relevant metrics. Company Name: {company_name}',
@manager_id, '', '');

INSERT INTO tasks (name, description, agent_id, tools, expected_output) VALUES
('Company Analyse Task',
'Conduct in-depth analysis of the company\'s financial performance, market position, business operations, and strategic positioning for a comprehensive understanding of the company. This task includes: - Conducting in-depth analysis of the company\'s financial performance, including detailed interpretation of financial statements, calculation and evaluation of key financial indicators, to better understand the company\'s profitability, solvency, and operational efficiency. - Assessing the company\'s market position within its industry, investigating factors such as market share, market growth rate, and competitive landscape, to help users understand the company\'s competitiveness and position in the industry. - Analyzing the company\'s business operations, including business model, products and services, customer base, sales channels, etc., to gain a more comprehensive understanding of the company\'s business operations and market positioning. - Analyzing the company\'s strategic positioning, including strategic planning, development goals, core competencies, and market positioning, to help users understand the company\'s future development direction and strategic planning. Your analysis should be logical, comprehensive, and methodical. Your final answer MUST be a Company Analysis Report. If you do your BEST WORK, I\'ll tip you $100!',
@manager_id, '', '');

INSERT INTO tasks (name, description, agent_id, tools, expected_output) VALUES
('Industry Analyse Search Task',
'Collect comprehensive information and data about the "{industry_name}" industry for analysis. The data is preferably cutting-edge, authoritative, and significant. This task involves gathering market reports, industry trends, regulatory updates, and any other relevant information to understand the dynamics of the industry. Your final report should include detailed findings and insights about the industry\'s market size, growth trends, competitive landscape, regulatory environment, and any other significant factors influencing the industry. Industry Name: {industry_name}',
@manager_id, '', '');

INSERT INTO tasks (name, description, agent_id, tools, expected_output) VALUES
('Industry Analyse Task',
'Perform in-depth analysis of the industry using available data and information. This task includes: - Analyzing market trends, growth prospects, and competitive landscape. - Assessing industry dynamics, including supply-demand balance and regulatory influences. - Evaluating technological advancements and innovation trends within the industry. - Formulating strategic recommendations based on analysis findings. Your analysis report should be thorough, insightful, and actionable. Your final answer MUST be an Industry Analysis Report. If you do your BEST WORK, I\'ll tip you $100!',
@manager_id, '', '');

INSERT INTO tasks (name, description, agent_id, tools, expected_output) VALUES
('Macroeconomy Analyse Search Task',
'Collect comprehensive macroeconomic data and information on "{country}" for analysis. This task involves gathering data related to GDP, inflation rate, unemployment rate, interest rates, trade data, government fiscal data, and any other relevant macroeconomic indicators. Your final report should include a detailed analysis of macroeconomic trends and factors influencing the economy. Country: {country}',
@manager_id, '', '');

INSERT INTO tasks (name, description, agent_id, tools, expected_output) VALUES
('Macroeconomy Analyse Task',
'Perform in-depth analysis of macroeconomic data and trends. This task includes: - Analyzing long-term trends and short-term fluctuations in key economic indicators. - Identifying causal relationships between different economic variables. - Comparing domestic economic data with international benchmarks. - Assessing the impact of economic policies on the economy. - Evaluating potential risks and uncertainties in the economic environment. - Forecasting future economic trends and providing strategic recommendations. Your analysis report should be thorough, insightful, and actionable. Your final answer MUST be a Macroeconomic Analysis Report. If you do your BEST WORK, I\'ll tip you $100!',
@manager_id, '', '');

INSERT INTO tasks (name, description, agent_id, expected_output) VALUES
('identify_task', 'Analyze and select the best city for the trip based on specific criteria such as weather patterns, seasonal events, and travel costs. This task involves comparing multiple cities, considering factors like current weather conditions, upcoming cultural or seasonal events, and overall travel expenses. Your final answer must be a detailed report on the chosen city, and everything you found out about it, including the actual flight costs, weather forecast and attractions. Traveling from: {origin} City Options: {cities} Trip Date: {range} Traveler Interests: {interests}', 1, 'A json object containing the chosen city, flight costs, weather forecast, and attractions.');

INSERT INTO tasks (name, description, agent_id, expected_output) VALUES
('gather_task', 'As a local expert on this city you must compile an in-depth guide for someone traveling there and wanting to have THE BEST trip ever! Gather information about key attractions, local customs, special events, and daily activity recommendations. Find the best spots to go to, the kind of place only a local would know. This guide should provide a thorough overview of what the city has to offer, including hidden gems, cultural hotspots, must-visit landmarks, weather forecasts, and high level costs. The final answer must be a comprehensive city guide, rich in cultural insights and practical tips, tailored to enhance the travel experience. Trip Date: {range} Traveling from: {origin} Traveler Interests: {interests}', 1, 'A json object containing a comprehensive city guide with key attractions, local customs, special events, daily recommendations, hidden gems, cultural hotspots, must-visit landmarks, weather forecasts, and high level costs.');

INSERT INTO tasks (name, description, agent_id, expected_output) VALUES
('plan_task', 'Expand this guide into a full 7-day travel itinerary with detailed per-day plans, including weather forecasts, places to eat, packing suggestions, and a budget breakdown. You MUST suggest actual places to visit, actual hotels to stay and actual restaurants to go to. This itinerary should cover all aspects of the trip, from arrival to departure, integrating the city guide information with practical travel logistics. Your final answer MUST be a complete expanded travel plan, formatted as markdown, encompassing a daily schedule, anticipated weather conditions, recommended clothing and items to pack, and a detailed budget, ensuring THE BEST TRIP EVER. Be specific and give it a reason why you picked each place, what makes them special!', 1, 'A json object containing a full 7-day travel itinerary with daily schedules, weather forecasts, places to eat, packing suggestions, and a budget breakdown.');

ALTER TABLE agents ADD COLUMN tools JSON;

INSERT INTO agents (name, role, goal, backstory, tools) VALUES
('city_selection_agent', 'City Selection Expert', 'Select the best city based on weather, season, and prices', 'An expert in analyzing travel data to pick ideal destinations', '["SearchTools.search_internet", "BrowserTools.scrape_and_summarize_website"]'),

('local_expert_agent', 'Local Expert at this city', 'Provide the BEST insights about the selected city', 'A knowledgeable local guide with extensive information about the city, it\'s attractions and customs', '["SearchTools.search_internet", "BrowserTools.scrape_and_summarize_website"]'),

('travel_concierge_agent', 'Amazing Travel Concierge', 'Create the most amazing travel itineraries with budget and packing suggestions for the city', 'Specialist in travel planning and logistics with decades of experience', '["SearchTools.search_internet", "BrowserTools.scrape_and_summarize_website", "CalculatorTools.calculate"]');

INSERT INTO agents (name, role, goal, backstory, tools) VALUES
('research_manager', 'Company Research Manager', 'Generate a list of JSON objects containing the urls for 3 recent blog articles and the url and title for 3 recent YouTube interviews, for each position in each company. Important: - The final list of JSON objects must include all companies and positions. Do not leave any out. - If you can\'t find information for a specific position, fill in the information with the word "MISSING". - Do not generate fake information. Only return the information you find. Nothing else! - Do not stop researching until you find the requested information for each position in each company. - All the companies and positions exist so keep researching until you find the information for each one. - Make sure you each researched position for each company contains 3 blog articles and 3 YouTube interviews.', 'As a Company Research Manager, you are responsible for aggregating all the researched information into a list.', '["SearchTools.search_internet", "BrowserTools.scrape_and_summarize_website"]'),

('research_agent', 'Company Research Agent', 'Look up the specific positions for a given company and find urls for 3 recent blog articles and the url and title for 3 recent YouTube interview for each person in the specified positions. Important: - Once you\'ve found the information, immediately stop searching for additional information. - Only return the requested information. NOTHING ELSE! - Make sure you find the persons name who holds the position. - Do not generate fake information. Only return the information you find. Nothing else!', 'As a Company Research Agent, you are responsible for looking up specific positions within a company and gathering relevant information.', '["SearchTools.search_internet", "BrowserTools.scrape_and_summarize_website"]');

INSERT INTO tasks (name, description, agent_id, expected_output) VALUES
('manage_research_task', 'Based on the list of companies {companies} and the positions {positions}, use the results from the Company Research Agent to research each position in each company to put together a json object containing the URLs for 3 blog articles, the URLs and title for 3 YouTube interviews for each position in each company.', 1, 'A json object containing the URLs for 3 blog articles and the URLs and titles for 3 YouTube interviews for each position in each company.'),

('company_research_task', 'Research the position {positions} for the {company} company. For each position, find the URLs for 3 recent blog articles and the URLs and titles for 3 recent YouTube interviews for the person in each position. Return this collected information in a JSON object. Helpful Tips: - To find the blog articles names and URLs, perform searches on Google such like the following: - "{company} [POSITION HERE] blog articles" - To find the youtube interviews, perform searches on YouTube such as the following: - "{company} [POSITION HERE] interview" Important: - Once you\'ve found the information, immediately stop searching for additional information. - Only return the requested information. NOTHING ELSE! - Do not generate fake information. Only return the information you find. Nothing else! - Do not stop researching until you find the requested information for each position in the company.', 1, 'A JSON object containing the researched information for each position in the company.');

INSERT INTO agents (name, role, goal, backstory, tools) VALUES
('company_information_collector', 'Company Information Collector', 'Collect comprehensive company information and data for analysis,The data is preferably cutting-edge,latest (2024), authoritative, and significant', 'Experienced in gathering and organizing company-related data for analysis', '["BrowserTools.scrape_and_summarize_website", "SearchTools.search_internet"]'),

('company_analyst', 'Company Analyst', 'Based on the data obtained from the search, analyze the company condition and form an analysis report', 'Proficient in analyzing company profiles and assessing corporate health', '["BrowserTools.scrape_and_summarize_website", "SearchTools.search_internet"]');

INSERT INTO agents (name, role, goal, backstory, tools) VALUES
('industy_information_collector', 'Industry Information Collector', 'Collect comprehensive industry information and data for analysis,The data is preferably cutting-edge,latest (2024), authoritative, and significant', 'Experienced in gathering and organizing industry-related data for analysis', '["BrowserTools.scrape_and_summarize_website", "SearchTools.search_internet"]'),

('industy_analyst', 'Industry Analyst', 'According to the data obtained from the search, analyze the industry status and form the industry analysis report', 'Experienced in analyzing industry data to identify trends, forecast market movements', '["BrowserTools.scrape_and_summarize_website", "SearchTools.search_internet"]');

INSERT INTO agents (name, role, goal, backstory, tools) VALUES
('macroeconomic_information_collector', 'Macroeconomic Information Collector', 'Collect comprehensive macro economic information and data for analysis,The data is preferably cutting-edge,latest (2024), authoritative, and significant', 'Experienced in gathering and organizing macroeconomic data for analysis', '["BrowserTools.scrape_and_summarize_website", "SearchTools.search_internet"]'),

('macroeconomic_analyst', 'Macroeconomic Analyst', 'Analyze macroeconomic data and trends, and provide insights and macroeconomic analysis report', 'Experienced in analyzing macroeconomic trends and forecasting', '["BrowserTools.scrape_and_summarize_website", "SearchTools.search_internet"]');

INSERT INTO tasks (name, description, agent_id, expected_output) VALUES
('collect_company_information_task', 'Collect comprehensive company information and data for analysis', 1, 'A JSON object containing financial reports, market data, business operations, and strategic positioning for the company.'),

('analyze_task', 'Analyze the collected company information and generate a detailed analysis report', 1, 'A JSON object containing the researched information and analysis, including financial reports, market data, business operations, strategic positioning, and a detailed analysis.');

INSERT INTO tasks (name, description, agent_id, expected_output) VALUES
('collect_industry_information_task', 'Collect comprehensive industry information and data for analysis', 2, 'A JSON object containing the market size, growth rate, key players, competitive landscape, regulatory environment, and technological advancements for the industry.'),

('analyze_industry_task', 'Analyze the collected industry information and generate a detailed analysis report', 2, 'A JSON object containing the researched information and analysis, including market size, growth rate, key players, competitive landscape, regulatory environment, technological advancements, and a detailed analysis.');

INSERT INTO tasks (name, description, agent_id, expected_output) VALUES
('collect_macroeconomic_task', 'Collect comprehensive macroeconomic information and data for analysis', 3, 'A JSON object containing the GDP, inflation rate, unemployment rate, interest rate, trade balance, and fiscal deficit for the country.'),

('macro_analyze_task', 'Analyze the collected macroeconomic information and generate a detailed analysis report', 3, 'A JSON object containing the researched information and analysis, including GDP, inflation rate, unemployment rate, interest rate, trade balance, fiscal deficit, and a detailed analysis.');

INSERT INTO crews (verbose, managellm) VALUES
(true, 'gpt4-turbo-preview'),
(false, 'gpt4-turbo-preview'),
(true, 'gpt4-turbo-preview');

INSERT INTO crew_tasks (crew_id, task_id) VALUES
(1, 10),
(1, 11),
(2, 12),
(2, 13),
(2, 14),
(2, 15),
(2, 16),
(2, 17),
(3, 8),
(3, 9),
(3, 7);

INSERT INTO crew_agents (crew_id, agent_id) VALUES
(1, 6),
(1, 7),
(2, 8),
(2, 9),
(2, 10),
(2, 11),
(2, 12),
(2, 13),
(3, 4),
(3, 5),
(3, 3);
