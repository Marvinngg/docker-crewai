from crewai import Task
from textwrap import dedent
from job_manager import append_event
from models import MacroEconomicData, MacroEconomicReport
from utils.logging import logger
from database_model import Task as DBTask
class MacroEconomicTasks:
    def __init__(self, job_id):
        self.job_id = job_id

    def append_event_callback(self, task_output):
        logger.info("Callback called: %s", task_output)
        append_event(self.job_id, task_output.exported_output)

    def collect_macroeconomic_task(self, agent, country):
        task_info = DBTask.query.filter_by(name='collect_macroeconomic_task').first()
        description = task_info.description
        expected_output = task_info.expected_output
        return Task(
            description=dedent(description.format(country=country)),
            agent=agent,
            callback=self.append_event_callback,
            output_json=MacroEconomicData,
            expected_output=expected_output,
            async_execution=True
        )

    def analyze_task(self, agent, task):
        task_info = DBTask.query.filter_by(name='macro_analyze_task').first()
        description = task_info.description
        expected_output = task_info.expected_output
        return Task(
            description=dedent(description),
            agent=agent,
            context=[task],
            callback=self.append_event_callback,
            output_json=MacroEconomicReport,
            expected_output=expected_output,
        )
