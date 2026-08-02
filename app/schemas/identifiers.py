from typing import Annotated

from pydantic import Field

MAX_SIGNED_INT32 = 2_147_483_647

ResourceId = Annotated[int, Field(ge=1, le=MAX_SIGNED_INT32)]
