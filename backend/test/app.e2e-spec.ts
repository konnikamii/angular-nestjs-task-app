import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from 'src/auth/dto';

describe('App (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(8000);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:8000');
  });
  afterAll(async () => {
    await app.close();
  });

  const dtoRegister: RegisterDto = {
    username: 'testuser2',
    email: 'test2@test.com',
    password: 'qwerty123',
  };

  describe('Auth', () => {
    describe('register', () => {
      it('should return 400 if username is missing', () => {
        return pactum
          .spec()
          .post('/api/register')
          .withMultiPartFormData({
            email: dtoRegister.email,
            password: dtoRegister.password,
          })
          .expectStatus(400);
      });
      it('should return 400 if email is missing', () => {
        return pactum
          .spec()
          .post('/api/register')
          .withMultiPartFormData({
            username: dtoRegister.username,
            password: dtoRegister.password,
          })
          .expectStatus(400);
      });
      it('should return 400 if password is missing', () => {
        return pactum
          .spec()
          .post('/api/register')
          .withMultiPartFormData({
            email: dtoRegister.email,
            username: dtoRegister.username,
          })
          .expectStatus(400);
      });
      it('should register a new user', () => {
        return pactum
          .spec()
          .post('/api/register')
          .withMultiPartFormData(dtoRegister)
          .expectStatus(201);
      });
    });

    describe('login', () => {
      it('should login successfully with username', () => {
        return pactum
          .spec()
          .post('/api/login')
          .withMultiPartFormData({
            username: dtoRegister.username,
            password: dtoRegister.password,
          })
          .expectStatus(200)
          .stores('userAT', 'access_token');
      });
      it('should login successfully with email', () => {
        return pactum
          .spec()
          .post('/api/login')
          .withMultiPartFormData({
            email: dtoRegister.email,
            password: dtoRegister.password,
          })
          .expectStatus(200)
          .stores('userAT', 'access_token');
      });
    });
  });

  describe('Users', () => {
    describe('getUser', () => {
      it('should return 401 if no token is provided', () => {
        return pactum.spec().get('/api/user').expectStatus(401);
      });
      it('should return 200 if token is provided', () => {
        return pactum
          .spec()
          .get('/api/user')
          .withHeaders({ Authorization: 'Bearer $S{userAT}' })
          .expectStatus(200);
      });
    });
    describe('getUsers', () => {
      it('should return 401 if no token is provided', () => {
        return pactum.spec().post('/api/users').expectStatus(401);
      });
      it('should return 200 if token is provided', () => {
        return pactum
          .spec()
          .post('/api/users')
          .withHeaders({ Authorization: 'Bearer $S{userAT}' })
          .withBody({ type: 'user_tasks' })
          .expectStatus(200);
      });
    });
    describe('changePassword', () => {
      it('should return 401 if no token is provided', () => {
        return pactum.spec().put('/api/change-password').expectStatus(401);
      });
      it('should return 200 if token is provided', () => {
        return pactum
          .spec()
          .put('/api/change-password')
          .withHeaders({ Authorization: 'Bearer $S{userAT}' })
          .withMultiPartFormData({
            old_password: dtoRegister.password,
            new_password: 'qwerty321',
          })
          .expectStatus(200);
      });
    });
  });
  describe('Tasks', () => {
    describe('createTask', () => {
      it('should return 401 if no token is provided', () => {
        return pactum.spec().post('/api/task/').expectStatus(401);
      });
      it('should return 201 if token is provided', () => {
        return pactum
          .spec()
          .post('/api/task/')
          .withHeaders({ Authorization: 'Bearer $S{userAT}' })
          .withBody({
            title: 'Task 1',
            description: 'Task 1 description',
            completed: true,
            due_date: new Date(),
          })
          .expectStatus(201)
          .stores('taskId', 'id');
      });
    });
    describe('getTaskById', () => {
      it('should return 404 if task does not exist', () => {
        return pactum
          .spec()
          .get('/api/task/99')
          .withHeaders({ Authorization: 'Bearer $S{userAT}' })
          .expectStatus(404);
      });
      it('should return 200 if task exists', () => {
        return pactum
          .spec()
          .get('/api/task/{id}')
          .withPathParams('id', '$S{taskId}')
          .withHeaders({ Authorization: 'Bearer $S{userAT}' })
          .expectStatus(200);
      });
    });
    describe('getPaginatedTasks', () => {
      it('should return 400 if request body is incorrect', () => {
        return pactum
          .spec()
          .post('/api/tasks/')
          .withHeaders({ Authorization: 'Bearer $S{userAT}' })
          .withBody({ page: 1, page_size: 10 })
          .expectStatus(400);
      });
      it('should return 200 if request body is correct', () => {
        return pactum
          .spec()
          .post('/api/tasks/')
          .withHeaders({ Authorization: 'Bearer $S{userAT}' })
          .withBody({
            page: 1,
            page_size: 10,
            sort_by: 'due_date',
            sort_type: 'asc',
          })
          .expectStatus(200);
      });
    });
    describe('updateTask', () => {
      it('should return 404 if task does not exist', () => {
        return pactum
          .spec()
          .put('/api/task/99')
          .withHeaders({ Authorization: 'Bearer $S{userAT}' })
          .expectStatus(404);
      });
      it('should return 200 if task exists', () => {
        return pactum
          .spec()
          .put('/api/task/{id}')
          .withPathParams('id', '$S{taskId}')
          .withHeaders({ Authorization: 'Bearer $S{userAT}' })
          .withBody({
            title: 'Updated Task 1',
            description: 'Updated Task 1 description',
            completed: false,
            due_date: null,
          })
          .expectStatus(200);
      });
    });
    describe('deleteTask', () => {
      it('should return 404 if task does not exist', () => {
        return pactum
          .spec()
          .delete('/api/task/99')
          .withHeaders({ Authorization: 'Bearer $S{userAT}' })
          .expectStatus(404);
      });
      it('should return 200 if task exists', () => {
        return pactum
          .spec()
          .delete('/api/task/{id}')
          .withPathParams('id', '$S{taskId}')
          .withHeaders({ Authorization: 'Bearer $S{userAT}' })
          .expectStatus(200);
      });
    });
  });
});
