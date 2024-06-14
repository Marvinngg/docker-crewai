from crewai import Agent
from langchain_community.llms import OpenAI
from crewai_tools import WebsiteSearchTool
from tools.browser_tools import BrowserTools
from tools.calculator_tools import CalculatorTools
from tools.search_tools import SearchTools
import json
from database_model import Agent as DBAgent
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
import os
# 加载环境变量
load_dotenv()

# 获取模型配置
MODEL = os.getenv('MODEL', 'gpt-4-turbo-preview')
class TripAgents():
  def __init__(self):
      self.llm = ChatOpenAI(model=MODEL)
  def city_selection_agent(self):
    agent_info = DBAgent.query.filter_by(name='city_selection_agent').first()
    role = agent_info.role
    goal = agent_info.goal
    backstory = agent_info.backstory
    # tools = agent_info.tools
        
        # 解析 JSON 字符串为 Python 列表
    # tools_list = json.loads(tools)
    return Agent(
        role=role,
        goal=goal,
        llm=self.llm,
        backstory=backstory,
        tools=[
            SearchTools.search_internet,
            BrowserTools.scrape_and_summarize_website,
            # WebsiteSearchTool()
        ],
        verbose=True)

  def local_expert(self):
    agent_info = DBAgent.query.filter_by(name='local_expert_agent').first()
    role = agent_info.role
    goal = agent_info.goal
    backstory = agent_info.backstory
    # tools = agent_info.tools
    return Agent(
        role=role,
        goal=goal,
        llm=self.llm,
        backstory=backstory,
        tools=[
            SearchTools.search_internet,
            BrowserTools.scrape_and_summarize_website,
            # WebsiteSearchTool()
        ],
        verbose=True)

  def travel_concierge(self):
    agent_info = DBAgent.query.filter_by(name='travel_concierge_agent').first()
    role = agent_info.role
    goal = agent_info.goal
    backstory = agent_info.backstory
    # tools = agent_info.tools
    return Agent(
        role=role,
        goal=goal,
        llm=self.llm,
        backstory=backstory,
        tools=[
            SearchTools.search_internet,
            BrowserTools.scrape_and_summarize_website,
            CalculatorTools.calculate,
            # WebsiteSearchTool()
        ],
        verbose=True)
