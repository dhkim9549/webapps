<%@page import="org.json.simple.*"%>
<%@page import="org.json.simple.parser.*"%>
<%@page import="java.io.PrintWriter"%>
<%@page import="java.rmi.*"%>
<%@page import="com.dhkim9549.mlptictactoe.RMIInterface"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%
	String boardJsonStr = request.getParameter("board");
	
    JSONParser jsonParser = new JSONParser();
    JSONObject jsonObj = null;
    try {
        jsonObj = (JSONObject)jsonParser.parse(boardJsonStr);
    } catch(Exception e) {
        System.out.println(e);
    }
	
	String remoteAddr = request.getRemoteAddr();
	String remoteHost = request.getRemoteHost();
	String x_forwarded_for = request.getHeader("x-forwarded-for");
	
	jsonObj.put("remoteAddr", remoteAddr);
	jsonObj.put("remoteHost", remoteHost);
	jsonObj.put("x-forwarded-for", x_forwarded_for);

	String a = "";
	RMIInterface look_up = null;
	
    try {
		look_up = (RMIInterface)Naming.lookup("//bada.ai/MyServer");
		a += look_up.helloTo(jsonObj.toString());
		Thread.sleep(300);
	} catch(Exception ex){
		a += ex;
	}
	
	PrintWriter pw = response.getWriter();
	out.print(a);
		
	return;
%>