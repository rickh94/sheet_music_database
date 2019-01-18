from knox.models import AuthToken


def create_knox_token(_token_model, user, _serializer):
    token = AuthToken.objects.create(user=user)
    return token
