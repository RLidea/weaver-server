const handler = {};

/*
  HTTP 상태 코드에 기반한 리턴
  https://developer.mozilla.org/ko/docs/Web/HTTP/Status
 */

const successMessageForm = (code, res, message, result) => {
  return res.status(code).json({ code, message, result });
};

const errorMessageForm = (code, res, message, detail) => {
  return res.status(code).json({ code, errors: { message, detail } });
};

// 1XX Information Responses
// 2XX Success

/*
  200 OK:
    요청이 성공적으로 되었습니다. 성공의 의미는 HTTP 메소드에 따라 달라집니다:
      GET(read): 리소스를 불러와서 메시지 바디에 전송되었습니다.
      HEAD: 개체 해더가 메시지 바디에 있습니다.
      PUT(update), POST(write), DELETE: 수행 결과에 대한 리소스가 메시지 바디에 전송되었습니다.
 */
handler.ok = (res, message, result) => {
  return successMessageForm(200, res, message, result);
};

/*
  201 Created:
    요청이 성공적이었으며 그 결과로 새로운 리소스가 생성되었습니다.
    이 응답은 일반적으로 POST 요청 또는 일부 PUT 요청 이후에 따라옵니다.
 */
handler.created = (res, message, result) => {
  res.header('Content-Location', result?.location);
  return successMessageForm(201, res, message, result);
};

/*
  202 Accepted:
    요청은 접수되었으나 리소스 처리가 완료되지 않았습니다. (비동기 응답같은 경우)
 */
handler.accepted = (res, message, result) => {
  return successMessageForm(202, res, message, result);
};

/*
  204 No Contents:
    요청은 성공했으나 제공할 콘텐츠가 없음.
    PUT: 수정이 성공적으로 완료되었고 콘텐츠를 반환하지 않았습니다. (수정에 성공했지만 변경사항이 없는 등, 컨텐츠를 돌려보내는게 의미가 없을때)
    DELETE: 삭제가 성공적으로 완료되었고 콘텐츠를 반환하지 않았습니다.
 */
handler.noContent = (res, message) => {
  return successMessageForm(204, res, message, 'no contents');
};

// 3XX Redirection
// 4XX Client errors

handler.badRequest = (res, message, detail) => {
  return errorMessageForm(400, res, message, detail);
};

/*
  401 Unauthorized:
    인증 오류. 인증되지 않은 접근을 시도했습니다.
 */
handler.unauthorized = (res, message, detail) => {
  return errorMessageForm(401, res, message, detail);
};

/*
  403 Forbidden:
    접근 금지. 권한 밖의 접근을 시도했습니다.
    401과 다른 점은 서버가 클라이언트가 누구인지 알고 있습니다
 */
handler.forbidden = (res, message, detail) => {
  return errorMessageForm(403, res, message, detail);
};

// 5XX Server errors
/*
  503 Service Unavailable:
    서버가 요청을 처리할 준비가 되지 않았습니다.
    일반적인 원인은 유지보수를 위해 작동이 중단되거나 과부하가 걸렸을 때 입니다.
 */
handler.serviceUnavailable = (res, message, detail) => {
  res.header('Retry-After', detail?.date);
  return errorMessageForm(503, res, message, detail);
};
module.exports = handler;
