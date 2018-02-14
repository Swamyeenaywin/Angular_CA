/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package sa45ca;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import static java.lang.System.in;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Scanner;
import javax.sql.DataSource;
import javax.annotation.Resource;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.MediaType;
import java.io.InputStream;
import java.sql.PreparedStatement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import javax.json.JsonArray;
import javax.json.JsonReader;

/**
 *
 * @author CSLee
 */
@WebServlet(name = "SaveGiphyServlet", urlPatterns = {"/giphy"})
public class SaveGiphyServlet extends HttpServlet {

    List<DataObject> list = new ArrayList<DataObject>();

    @Resource(lookup = "jdbc/angularca")
    private DataSource connPool;

    //Method to retrieve Giphy
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String sql = "select * from images as i join users as u on i.user_time_id = u.user_time_id where u.username='"
                + request.getParameter("user") + "'";

        JsonArrayBuilder giphyBuilder = Json.createArrayBuilder();
        try (Connection conn = connPool.getConnection()) {
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql);

            while (rs.next()) {
                JsonObject giphy = Json.createObjectBuilder()
                        .add("giphy_url", rs.getString("imageurl"))
                        .build();
                giphyBuilder.add(giphy);
            }
        } catch (SQLException ex) {
            log(ex.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }

        try (PrintWriter pw = response.getWriter()) {
            response.setStatus(HttpServletResponse.SC_ACCEPTED);
            response.setContentType(MediaType.APPLICATION_JSON);
            pw.println(giphyBuilder.build().toString());
        }
    }

    //Method to save selected Giphy
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        StringBuilder sb = new StringBuilder();
        try (InputStream is = request.getInputStream();
                JsonReader rdr = Json.createReader(is)) {
            JsonObject obj = rdr.readObject();
            JsonArray results = obj.getJsonArray("data");
            for (JsonObject result : results.getValuesAs(JsonObject.class)) {
                DataObject dto = new DataObject();
                dto.setUser(result.getString("user"));
                dto.setTimeSelected(result.getString("timeselected"));
                dto.setImageUrl(result.getString("imageurl"));
                list.add(dto);
            }
        }
        //Update Database
        String updateStatus = writeData(list);
        try (PrintWriter pw = response.getWriter()) {
            response.setStatus(HttpServletResponse.SC_ACCEPTED);
            response.setContentType(MediaType.TEXT_PLAIN);
            pw.println(sb.toString() + updateStatus);
        }

    }

//  static String extractPostRequestBody(HttpServletRequest request) throws IOException {
//    if ("POST".equalsIgnoreCase(request.getMethod())) {
//        Scanner s = new Scanner(request.getInputStream(), "UTF-8").useDelimiter("\\A");
//        return s.hasNext() ? s.next() : "";
//    }
//    return "";
//}
    //Working SQL:
//    BEGIN;
//INSERT INTO users (username, timeselected)
//  VALUES('userC', '2018-02-14 05:00:30');
//INSERT INTO images (user_time_id, imageurl) 
//  VALUES(LAST_INSERT_ID(),'https://media1.giphy.com/media/mlvseq9yvZhba/giphy-downsized.gif');
//COMMIT;
    public String writeData(List<DataObject> dtoList) {
        String insertSql1;
        String insertSql2;
        for (DataObject dto : dtoList) {
            try (Connection conn = connPool.getConnection()) {
                conn.setAutoCommit(false);

                insertSql1 = "INSERT INTO users (username, timeselected)"
                        + "VALUES(?,?);";

                insertSql2 = "INSERT INTO images (user_time_id, imageurl)"
                        + "VALUES(LAST_INSERT_ID(),?);";
                try (PreparedStatement ps1 = conn.prepareStatement(insertSql1);
                        PreparedStatement ps2 = conn.prepareStatement(insertSql2);) {
                    ps1.setString(1, dto.getUser());
                    ps1.setString(2, dto.getTimeSelected());
                    ps1.executeUpdate();
                    ps2.setString(1, dto.getImageUrl());
                    ps2.executeUpdate();
                    conn.commit();

                } catch (SQLException ex) {
                    conn.rollback();
                    conn.setAutoCommit(true);
                    throw ex;
                }
            } catch (SQLException ex) {
                log(ex.getMessage());
                return ex.getMessage();
            }
        }
        //Clear List after success
        list.clear();
        return "OK";
    }
}
