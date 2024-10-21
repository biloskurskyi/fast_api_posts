# import os
# import pytest
# from sqlalchemy import Column, Integer, String, Boolean, DateTime, create_engine, func
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker
#
# Base = declarative_base()
#
#
# class Comment(Base):
#     __tablename__ = "test_comments"
#
#     id = Column(Integer, primary_key=True, index=True)
#     info = Column(String)
#     is_valid = Column(Boolean, default=True)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())
#
#
# @pytest.fixture(scope='module', autouse=True)
# def setup_database():
#     if os.path.exists("..test.db"):
#         os.remove("..test.db")
#     engine = create_engine("sqlite:///./test.db")
#     Base.metadata.create_all(engine)
#     yield
#     if os.path.exists("..test.db"):
#         os.remove("..test.db")
#
#
# @pytest.fixture(scope='function')
# def db():
#     engine = create_engine('sqlite:///:memory:')
#     Base.metadata.create_all(engine)
#     TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
#
#     db = TestingSessionLocal()
#     yield db
#     db.close()
#     Base.metadata.drop_all(engine)
#
#
# @pytest.fixture(scope="function")
# def test_comment(db):
#     comment = Comment(info="This is a test comment.")
#     db.add(comment)
#     db.commit()
#     db.refresh(comment)
#     return comment
#
#
# def test_create_test_comment(db):
#     new_comment = Comment(info="New test comment")
#     db.add(new_comment)
#     db.commit()
#     assert new_comment.id is not None
#     assert new_comment.info == "New test comment"
#
#
# def test_read_test_comment(db, test_comment):
#     comment = db.query(Comment).filter(Comment.id == test_comment.id).first()
#     assert comment is not None
#     assert comment.info == test_comment.info
#
#
# def test_update_test_comment(db, test_comment):
#     test_comment.info = "Updated test comment"
#     db.commit()
#     updated_comment = db.query(Comment).filter(Comment.id == test_comment.id).first()
#     assert updated_comment.info == "Updated test comment"
#
#
# def test_delete_test_comment(db, test_comment):
#     db.delete(test_comment)
#     db.commit()
#     deleted_comment = db.query(Comment).filter(Comment.id == test_comment.id).first()
#     assert deleted_comment is None
