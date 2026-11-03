from importlib import resources
from string import Template


def load_prompt(name: str) -> Template:
    text = resources.files("app.llm").joinpath("prompts", f"{name}.txt").read_text("utf-8")
    return Template(text)
