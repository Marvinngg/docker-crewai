from crewai import Task, Agent
from textwrap import dedent
from job_manager import append_event
from models import PositionInfo, PositionInfoList
from utils.logging import logger
from database_model import Task as DBTask

class CompanyResearchTasks():

    def __init__(self, job_id):
        self.job_id = job_id

    def append_event_callback(self, task_output):
        logger.info("Callback called: %s", task_output)
        append_event(self.job_id, task_output.exported_output)

    def get_task_info(self, task_name):
        task_info = DBTask.query.filter_by(name=task_name).first()
        description = task_info.description
        expected_output = task_info.expected_output
        return description, expected_output

    def manage_research(self, agent: Agent, companies: list[str], positions: list[str], tasks: list[Task]):
        description, expected_output = self.get_task_info('manage_research_task')
        return Task(
            description=description.format(companies=companies, positions=positions),
            agent=agent,
            expected_output=expected_output,
            callback=self.append_event_callback,
            context=tasks,
            output_json=PositionInfoList
        )

    def company_research(self, agent: Agent, company: str, positions: list[str]):
        description, expected_output = self.get_task_info('company_research_task')
        return Task(
            description=description.format(company=company, positions=positions),
            agent=agent,
            expected_output=expected_output,
            callback=self.append_event_callback,
            output_json=PositionInfo,
            async_execution=True
        )
