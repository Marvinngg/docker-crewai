from crewai import Task
from textwrap import dedent
from datetime import date
from utils.logging import logger
from job_manager import append_event
from models import CityReport, CityGuideOutput, TravelPlanOutput
from database_model import Task as DBTask

class TripTasks():
    def __init__(self, job_id):
        self.job_id = job_id

    def append_event_callback(self, task_output):
        logger.info("Callback called: %s", task_output)
        append_event(self.job_id, task_output.exported_output)

    def identify_task(self, agent, origin, cities, interests, range):
        task_info = DBTask.query.filter_by(name='identify_task').first()
        description = task_info.description
        expected_output = task_info.expected_output
        return Task(
            description=description.format(origin=origin, cities=cities, range=range, interests=interests),
            agent=agent,
            expected_output=expected_output,
            callback=self.append_event_callback,
            output_json=CityReport
        )

    def gather_task(self, agent, origin, interests, range):
        task_info = DBTask.query.filter_by(name='gather_task').first()
        description = task_info.description
        expected_output = task_info.expected_output
        return Task(
            description=description.format(origin=origin, range=range, interests=interests),
            agent=agent,
            expected_output=expected_output,
            callback=self.append_event_callback,
            output_json=CityGuideOutput
        )

    def plan_task(self, agent, origin, interests, range):
        task_info = DBTask.query.filter_by(name='plan_task').first()
        description = task_info.description
        expected_output = task_info.expected_output
        return Task(
            description=description.format(origin=origin, range=range, interests=interests),
            agent=agent,
            expected_output=expected_output,
            callback=self.append_event_callback,
            output_json=TravelPlanOutput
        )
