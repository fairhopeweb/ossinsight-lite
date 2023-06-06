-- db:oh-my-github
SELECT t_month AS event_month, xs, s, m, l, xl, xxl, all_size
FROM (
    SELECT
        t_month,
        SUM(IF(changes < 10, 1, 0)) OVER(PARTITION BY t_month)                      AS xs,
        SUM(IF(changes >= 10 AND changes < 30, 1, 0)) OVER(PARTITION BY t_month)    AS s,
        SUM(IF(changes >= 30 AND changes < 100, 1, 0)) OVER(PARTITION BY t_month)   AS m,
        SUM(IF(changes >= 100 AND changes < 500, 1, 0)) OVER(PARTITION BY t_month)  AS l,
        SUM(IF(changes >= 500 AND changes < 1000, 1, 0)) OVER(PARTITION BY t_month) AS xl,
        SUM(IF(changes >= 1000, 1, 0)) OVER (PARTITION BY t_month)                  AS xxl,
        COUNT(*) OVER (PARTITION BY t_month)                                        AS all_size,
        ROW_NUMBER() OVER (PARTITION BY t_month)                                    AS row_num
    FROM (
        SELECT
            DATE_FORMAT(created_at, '%Y-%m-01') AS t_month,
            additions + deletions AS changes
        FROM pull_requests
        WHERE
            created_at > DATE_SUB(NOW(), INTERVAL 1 YEAR)
            AND user_id = (SELECT id FROM curr_user LIMIT 1)
    ) sub
) AS sub
WHERE
    row_num = 1