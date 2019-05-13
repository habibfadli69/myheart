from jsonschema import validate
from jsonschema.exceptions import ValidationError
from jsonschema.exceptions import SchemaError

label_schema = {
    "type": "object",
    "properties": {
        "namaLabel": {
            "type": "string",
        },
        "labelIdentity": {
            "type": "number"
        }
    },
    "required": ["namaLabel","labelIdentity"],
    "additionalProperties": False
}


def validate_label(data):
    try:
        validate(data, label_schema)
    except ValidationError as e:
        return {'ok': False, 'message': e}
    except SchemaError as e:
        return {'ok': False, 'message': e}
    return {'ok': True, 'data': data}