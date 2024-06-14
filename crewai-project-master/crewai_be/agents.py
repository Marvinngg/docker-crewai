from typing import List
from crewai import Agent
from langchain_openai import ChatOpenAI
from crewai_tools import SerperDevTool
from tools.youtube_search_tools import YoutubeVideoSearchTool
from database_model import Agent as DBAgent
from dotenv import load_dotenv
import os

# 加载环境变量
load_dotenv()

# 获取模型配置
MODEL = os.getenv('MODEL', 'gpt-4-turbo-preview')
class CompanyResearchAgents():

  def __init__(self):
    self.searchInternetTool = SerperDevTool()
    self.youtubeSearchTool = YoutubeVideoSearchTool()
    self.llm = ChatOpenAI(model=MODEL)

  def research_manager(self, companies: List[str], positions: List[str]) -> Agent:
    agent_info = DBAgent.query.filter_by(name='research_manager').first()
    role = agent_info.role
    goal = f"{agent_info.goal}\n\nCompanies: {companies}\nPositions: {positions}"
    backstory = agent_info.backstory
    return Agent(
      role=role,
      goal=goal,
      backstory=backstory,
      llm=self.llm,
      tools=[self.searchInternetTool, self.youtubeSearchTool],
      verbose=True,
      allow_delegation=True
    )

  def company_research_agent(self) -> Agent:
    agent_info = DBAgent.query.filter_by(name='research_agent').first()
    role = agent_info.role
    goal = agent_info.goal
    backstory = agent_info.backstory
    return Agent(
      role=role,
      goal=goal,
      backstory=backstory,
      tools=[self.searchInternetTool, self.youtubeSearchTool],
      llm=self.llm,
      verbose=True
    )
