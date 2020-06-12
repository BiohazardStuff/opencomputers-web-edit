enum MessageAction {
  ERROR= "error",
  CONNECTED = "connected",
  INITIALIZE = "initialize",
  REQUEST_AUTH = "request_auth",
  CONFIRM_ACCESS_CODE = "confirm_access_code",
  CONFIRM_CONNECTION = "confirm_connection",
  AUTHENTICATE = "authenticate",
  CHECK_ACCESS_CODE = "check_access_code",
  PULL_DIRECTORY = "pull_directory",
  PUSH_DIRECTORY = "push_directory",
  PULL_FILE = "pull_file",
  PUSH_FILE = "push_file",
}

export default MessageAction;
