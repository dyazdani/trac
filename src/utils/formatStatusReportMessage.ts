export default function formatStatusReportMessage(message: string) {
    return message.split('\n')
        .filter(str => !!str)
        .map(str => '<p>' + str + '</p>')
        .join("");
}