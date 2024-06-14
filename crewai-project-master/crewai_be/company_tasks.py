from crewai import Task
from textwrap import dedent
from job_manager import append_event
from models import CompanyAnalysisData, CompanyReport
from utils.logging import logger
import global_config  # 引用全局常量
from database_model import Task as DBTask
class CompanyAnalysisTasks:
    def __init__(self, job_id):
        self.job_id = job_id

    def append_event_callback(self, task_output):
        logger.info("Callback called: %s", task_output)
        append_event(self.job_id, task_output.exported_output)

    def collect_company_information_task(self, agent, company_name):
        task_info = DBTask.query.filter_by(name='collect_company_information_task').first()
        description = task_info.description
        expected_output = task_info.expected_output
        return Task(
            description=dedent(description.format(company_name=company_name)),
            agent=agent,
            callback=self.append_event_callback,
            output_json=CompanyAnalysisData,
            expected_output=expected_output,
            async_execution=True
        )

    def analyze_task(self, agent, task):
        task_info = DBTask.query.filter_by(name='analyze_task').first()
        description = task_info.description
        expected_output = task_info.expected_output
        return Task(
            description=dedent(description),
            agent=agent,
            context=[task],
            callback=self.append_event_callback,
            output_json=CompanyReport,
            expected_output=expected_output,
        )