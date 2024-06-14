from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:123456@localhost/crewai'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Job(db.Model):
    __tablename__ = 'jobs'
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.String(36), unique=True, nullable=False)
    status = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

class JobResult(db.Model):
    __tablename__ = 'job_results'
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.String(36), nullable=False)
    result = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    job_id = db.Column(db.String(36), db.ForeignKey('jobs.job_id'))

class Agent(db.Model):
    __tablename__ = 'agents'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.Text)
    goal = db.Column(db.Text)
    backstory = db.Column(db.Text)
    llm = db.Column(db.String(255))

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    agent_id = db.Column(db.Integer, db.ForeignKey('agents.id'), nullable=False)
    tools = db.Column(db.Text)
    expected_output = db.Column(db.Text)
    agent = db.relationship('Agent', backref='tasks')

class Crew(db.Model):
    __tablename__ = 'crews'
    id = db.Column(db.Integer, primary_key=True)
    verbose = db.Column(db.Boolean, default=False)
    managellm = db.Column(db.String(255))

class CrewTask(db.Model):
    __tablename__ = 'crew_tasks'
    id = db.Column(db.Integer, primary_key=True)
    crew_id = db.Column(db.Integer, db.ForeignKey('crews.id'), nullable=False)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=False)
    crew = db.relationship('Crew', backref='crew_tasks')
    task = db.relationship('Task', backref='crew_tasks')

class CrewAgent(db.Model):
    __tablename__ = 'crew_agents'
    id = db.Column(db.Integer, primary_key=True)
    crew_id = db.Column(db.Integer, db.ForeignKey('crews.id'), nullable=False)
    agent_id = db.Column(db.Integer, db.ForeignKey('agents.id'), nullable=False)
    crew = db.relationship('Crew', backref='crew_agents')
    agent = db.relationship('Agent', backref='crew_agents')


@app.route('/jobs', methods=['GET'])
def get_jobs():
    jobs = Job.query.all()
    output = []
    for job in jobs:
        job_data = {
            'id': job.id,
            'job_id': job.job_id,
            'status': job.status,
            'created_at': job.created_at.isoformat(),
            'updated_at': job.updated_at.isoformat()
        }
        output.append(job_data)
    return jsonify({'jobs': output})

# 定义其他路由和对应的处理函数
@app.route('/job', methods=['GET'])
def get_job():
    job_id = "f729d73a-8e42-4771-b48f-6052d5d379f0"
    job = Job.query.filter_by(job_id=job_id).first()
    if not job:
        return jsonify({'message': 'Job not found'}), 404
    job_data = {
        'id': job.id,
        'job_id': job.job_id,
        'status': job.status,
        'created_at': job.created_at.isoformat(),
        'updated_at': job.updated_at.isoformat()
    }
    return jsonify(job_data)

@app.route('/job', methods=['POST'])
def create_job():
    data = request.get_json()
    job_id = data.get('job_id')
    status = data.get('status')
    if not job_id or not status:
        return jsonify({'message': 'Both job_id and status are required'}), 400
    job = Job(job_id=job_id, status=status)
    db.session.add(job)
    db.session.commit()
    return jsonify({'message': 'Job created successfully'}), 201

@app.route('/job/<job_id>', methods=['PUT'])
def update_job(job_id):
    job = Job.query.filter_by(job_id=job_id).first()
    if not job:
        return jsonify({'message': 'Job not found'}), 404
    data = request.get_json()
    status = data.get('status')
    if not status:
        return jsonify({'message': 'Status is required'}), 400
    job.status = status
    db.session.commit()
    return jsonify({'message': 'Job updated successfully'}), 200

@app.route('/job/<job_id>', methods=['DELETE'])
def delete_job(job_id):
    job = Job.query.filter_by(job_id=job_id).first()
    if not job:
        return jsonify({'message': 'Job not found'}), 404
    db.session.delete(job)
    db.session.commit()
    return jsonify({'message': 'Job deleted successfully'}), 200
if __name__ == '__main__':
    app.run(debug=True, port=3001)
