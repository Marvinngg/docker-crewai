from crewai import Agent
from langchain_community.llms import OpenAI

from tools.browser_tools import BrowserTools
from tools.search_tools import SearchTools
from crewai_tools import WebsiteSearchTool
from dotenv import load_dotenv
from database_model import Agent as DBAgent
from langchain_openai import ChatOpenAI
import os
# 加载环境变量
load_dotenv()

# 获取模型配置
MODEL = os.getenv('MODEL', 'gpt-4-turbo-preview')
# tool1 = WebsiteSearchTool(website='https://example.com')
# tool2 = WebsiteSearchTool(website='https://example.com')   # 预留权威网站地址，实现在网站内容中进行语义搜索
class IndustryAnalysisAgents:
    def __init__(self):
      self.llm = ChatOpenAI(model=MODEL)
    def industy_information_collector(self):
      agent_info = DBAgent.query.filter_by(name='industy_information_collector').first()
      role = agent_info.role
      goal = agent_info.goal
      backstory = agent_info.backstory
      return Agent(
        role=role,
        goal=goal,
        llm=self.llm,
        backstory=backstory,
        tools=[
                BrowserTools.scrape_and_summarize_website,
                SearchTools.search_internet,
            ],    #如果要加入设置权威网站地址，可以这里加入tool1,tool2。
        verbose=True)

    def industy_analyst(self):
      agent_info = DBAgent.query.filter_by(name='industy_analyst').first()
      role = agent_info.role
      goal = agent_info.goal
      backstory = agent_info.backstory
      return Agent(
        role=role,
        goal=goal,
        llm=self.llm,
        backstory=backstory,
        tools=[
                BrowserTools.scrape_and_summarize_website,
                SearchTools.search_internet,
            ],    #如果要加入设置权威网站地址，可以这里加入tool1,tool2。
        verbose=True)


