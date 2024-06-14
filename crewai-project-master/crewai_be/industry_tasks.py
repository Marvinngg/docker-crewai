from crewai import Task
from textwrap import dedent
from job_manager import append_event
from models import IndustryData, IndustryReport
from utils.logging import logger
from database_model import Task as DBTask
class IndustryAnalysisTasks:
    def __init__(self, job_id):
        self.job_id = job_id

    def append_event_callback(self, task_output):
        logger.info("Callback called: %s", task_output)
        append_event(self.job_id, task_output.exported_output)

    def collect_industry_information_task(self, agent, industry_name):
        task_info = DBTask.query.filter_by(name='collect_industry_information_task').first()
        description = task_info.description
        expected_output = task_info.expected_output
        return Task(
            description=dedent(description.format(industry_name=industry_name)),
            agent=agent,
            callback=self.append_event_callback,
            output_json=IndustryData,
            expected_output=expected_output,
            async_execution=True
        )

    def analyze_industry_task(self, agent, task):
        task_info = DBTask.query.filter_by(name='analyze_industry_task').first()
        description = task_info.description
        expected_output = task_info.expected_output
        return Task(
            description=dedent(description),
            agent=agent,
            context=[task],
            callback=self.append_event_callback,
            output_json=IndustryReport,
            expected_output=expected_output,
        )
