<%@page import="java.io.*"%>
<%@page import="java.net.*"%>
<%@page import="java.util.*"%>
<%@page import="org.json.simple.*"%>
<%@page import="org.json.simple.parser.*"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%

	String inputValue = request.getParameter("inputValue");
	
        URL url = new URL("http://app.hf.go.kr/nhfm/hfFamily/search.html");
        URLConnection conn = url.openConnection();
        conn.setRequestProperty("accept-language", "ko");
        conn.setDoOutput(true);
        OutputStreamWriter writer = new OutputStreamWriter(conn.getOutputStream(), "euc-kr");

        writer.write("inputValue=" + inputValue);
        writer.flush();
        int c;
		InputStreamReader isr = new InputStreamReader(conn.getInputStream(), "UTF-8");

        while ((c = isr.read()) != -1) {
            out.write(c);
        }
        writer.close();
        isr.close();

		
	return;
%>

